require('dotenv').config();
const {createServer} = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const {ApolloServer, PubSub} = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const {readFileSync} = require('fs');
const {MongoClient} = require('mongodb');


const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
const {resolvers} = require('./resolvers');

async function start() {
    const app = express();
    const MONGO_DB = process.env.DB_HOST;

    const client = await MongoClient.connect(MONGO_DB, {useNewUrlParser: true});
    const db = client.db();
    //const context = {db};

    const pubsub = new PubSub();

    /* Context can be an object or a function. For our application to work, we need it to be a function so that
     * we can set the context every time there is a request. When context is a function, it is invoked for every
     * GraphQL request.  The object that is returned by this function is the context that is sent to the resolver.
     */
    const server =  new  ApolloServer({
                            typeDefs,
                            resolvers,
                            context: async ({req, connection}) => {
                                const githubToken = req ? req.headers.authorization : connection.context.Authorization;
                                const currentUser = await db.collection('users').findOne({githubToken})
                                return {db, currentUser, pubsub}
                            }
                            /* Queries and Mutations use HTTP. 
                             * When we send either of these operations to the GraphQL Service the request argument, req is sent to the context handle.
                             * However, when the operation is a Subscription, there is no HTTP request so the req argument is null.                             
                             * Information for subscriptiions is instean passed when thhe client connects to the WebSocket.
                             * Inthis case, the  WebSocker connection argument will be sent to the context function instead.
                             */
                        });


    server.applyMiddleware({app})

    //app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res, next) => {
        res.send("Welcome to the Apollo Photo Sharinig Service");
    });
    app.get('/playground', expressPlayground({endpoint: '/graphql'}));

    //app.listen({port: 4000}, {hostname: 'apollo-exp'}, () => console.log(`GraphQL Server running @ localhost:4000${server.graphqlPath}`));
    
    /** To enable WebSocket for subscription operation */
    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({port: process.env.PORT}, 
      () => console.info(`GraphQL Server running at localhost:${process.env.PORT}${server.graphqlPath}`)
    );
}

start()



/** Query Samples */
/*
// Add photo
 mutation post($input: PostPhotoInput!) {
  postPhoto(input: $input) {
    id
    url
    postedBy {
      name
      avatar
    }
  }
}

// Add Users
mutation addUsers{
  addFakeUsers(count: 1) {
    name
  }
}

// Get users token
mutation authFakeUse {
  fakeUserAuth(githubLogin: "purpleswan668") {
    token
  }
}

// Authorization with access token
{
  "Authorization": "e3b2112b3cc008185dcfa92a7e5fb62e3a4d7650"
}

// Subscription Operation Sample
 subscription {
   newPhoto {
     url
     category 
     postedBy {
       githubLogin
       avater
     }
   }
 }

 //
 $input for PhotoInput
 {
   input: {
     name: "Zebbra",
     category: "LANDSCAPE",
     description: "Zebbra photograph",
     
  }

 }
*/
