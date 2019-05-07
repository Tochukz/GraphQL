const fetch = require('node-fetch');
const {users, photos, tags} = require('./data/test-data');
const {GraphQLScalarType} = require('graphql');
const {authorizeWithGithub} = require('./lib');

const resolvers = {
    Query : {
        me: (parent, args, {currentUser}) => currentUser,
        totalPhotos: (parent, args, {db}) =>  db.collection('photos').estimatedDocumentCount(),
        allPhotos: (parent, args, {db}) => db.collection('photos').find().toArray(),
        totalUsers: (parent, args, {db}) => db.collection('users').estimatedDocumentCount(),
        allUsers: (parent, args, {db}) => db.collection('users').find().toArray()
    },
    Mutation: {
        async postPhoto(parent, args, {db, currentUser}){
            if (!currentUser) {
              throw new Error('Only an authorized user can post a photo');
            }
            
            const newPhoto = {           
                ...args.input,
                userID: currentUser.githubLogin,                                
                created: new Date()
            }
            const {insertedIds} = await db.collection('photos').insert(newPhoto);
            newPhoto.id = insertedIds[0];
            return newPhoto;
        },
        async githubAuth(parent, {code}, {db}){
          let {message, access_token, avatar_url, login, name} = await authorizeWithGithub({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code
          });

          if (message) {
            throw new Error(message);
          }

          let latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url
          }
          const {ops: [user]} = await db.collection('users')
                                        .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true});
          return {user, token: access_token}

        },
        addFakeUsers: async (parent, {count}, {db}) => {
          const randomUserApi = `http://randomuser.me/api/?results=${count}`;
          const {results} = await fetch(randomUserApi)
                                  .then(res => res.json());
          const users = results.map(result => ({
                 githubLogin: result.login.username,
                 name: `${result.name.first} ${result.name.last}`,
                 avatar: result.picture.thumbnail,
                 githubToken: result.login.sha1
              })
          )

          const {insertedIds} = await db.collection('users').insert(users);
          users.id = insertedIds[0];
          return users;
        },
        async fakeUserAuth(parent, {githubLogin}, {db}) {
          const user = await db.collection('users').findOne({githubLogin});
          if (!user) {
            throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
          }

          return {token: user.githubToken, user};
        }         
    },
    Photo: { // The parent argument will be a $photo object. The $photo object blue  print is defined in the schema definition and the actual object is return from any Query type that returns $photo
        id: parent => parent.id || parent._id,
        url: parent => `http://localhost:4000/img/${parent.id}.jpg`,
        postedBy: (parent, args, {db}) => db.collection('photos').findOne({githubLogin: parent.githubLogin}),
        taggedUsers: parent => {
          //Filter out the userIDs from the photo
          let userIDs = tags.filter(tag => tag.photoID == parent.id)
                            .map(tag => tag.userID);
          return users.filter(user => userIDs.includes(user.githubLogin));
        }
    },
    User: { // The parent argument will be a $user object. The $user object blue print is defined in the schema...
        postedPhotos: parent => photos.filter(photo => photo.githubUser === parent.githubLogin),
        /*
        inPhotos: parent => {
          //Filter out the photoIDs where the user is tagged
          let photoIDs = tags.filter(tag => tag.userID === parent.githubLogin)
                             .map(tag => tag.photoID);
          //Filter out the photos having the photoIDs above
          return photos.filters(photo => photosIDs.includes(photo.id));
        }
        */
        inPhotos: parent => tags.filter(tag => tag.userID == parent.githubLogin)
                                .map(tag => tag.photoID)
                                .map(photoID => photos.find(photo => photo.id === photoID)),
        id: parent => parent._id
    },
    DateTime: new GraphQLScalarType({
      name: 'DateTime',
      description: 'A valid date time value.',
      parseValue: value => new Date(value),
      serialize: value => new Date(value).toISOString(),
      parseLiteral: ast => ast.value //Abstract syntax tree (AST).
    }),
    /**
     * When creating a custom scalar type, we need to add the three functions: serialize, parseValue, and parseLiteral,
     * which will handle any fields or arguments that implement the DateType scalar.
     */

}

/**
 * This Photo resolver added to the root is called a trivial resolver. Trivial resolvers are added to the top level of the resolvers object,
 * but they are not required. We have the option to create custom resolvers for the Photo object using a trivial resolver. If you do not specify a trivial resolver,
 * GraphQL will fall back to a default resolver that returns a property as the same name as the field.
 *
 * Note that only the url field is resolved here.
 * All other fields are resolved by their corresponding keys in the Photo object(s) returned from allPhotos and postPhoto in Query and Mutation respectively.
 */


 module.exports = {resolvers};


 /**
  * To Authenticate A User  with Github OAuth
  * Step 1 
  *   Ask for the authorization code:
  *     https://github.com/login/oauth/authorize?client_id=YOUR_APP_ID-HERE&scope=user
  *   The user's authorization code will be sent to you App's redrect URL as a query string parameter after the user grants access permission.
  *     http://locahost:3000?code=2aBcDxyZ1
  * 
  *  Step 2:
  *   Use the code from the URL string above to ask for a token from github.
  *   Front End GraphQL Query
  *     mutation {
  *        githubAuth(code: "2aBcDxyZ1") {
  *            token
  *            user {
  *              githubLogin
  *              name
  *              avatar
  *            }
  *        }
  *     }
  *     
  *     BackEnd HTTP Request (userCode will be the 'code' obtained from the query string above in Step  1)
  *       POST /login/oauth/access_token HTTP/1.1
  *       Host: https://github.com
  *       Accept: application/json
  *       Content-Type: application/json
  *
  *       {
  *         client_id: appID,
  *         client_secret: appSecret,
  *         client_code: userCode
  *       }
  * 
  *     This backend HTTP request is wrapped in a resolver function. The body json string is the app+user credential.
  *     The json response from this HTTP request will contain access_token which we will use for subsequent requests.
  * 
  *  Step 3 
  *    Use the access_token obtained from Step 2 to request for the users informatiion from Github
  *    Backend HTTP Request
  *    GET /user?access_token=access_token HTTP/1.1
  *    Host: https://api.github.com
  *    Accept: application/json 
  * 
  *   The json response will contain the user infomation which will then be passed to the GraphQL client via the resolver.
  *    
  * Step 4
  *  The user information obtained from Step 3 will be store in the database. The client will store a copy of the access_token from Step 3.
  *  When the client makes subsequent request, he will send an Authorization header whose value is the access_token:
  *  GraphQL Client
  *    query currentUser {
  *      me {
  *        githubLogin
  *        name
  *        avatar
  *      }  
  *    }
  *   
  *   
  *    {
  *      Authorization: 'a6785hms8304hnkfk49905nnsk'
  *    }
  * 
  *  The Server will authenticate the user against a user in the database using this access_token found in the Authorization header.
  */



 