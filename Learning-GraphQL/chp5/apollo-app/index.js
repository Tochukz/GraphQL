const {ApolloServer} = require('apollo-server');
const {resolvers} = require('./api/resolvers');
const {typeDefs} = require('./api/schema');

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen()
      .then(({url}) => console.log(`GraphQL Service running on ${url}`))