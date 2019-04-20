const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean} = require('graphql');

const queryType = new GraphQLObjectType({
    name: 'User',
    fields: {
        usersCount: {
            type: GraphQLInt,
            resolve: (_, args, {db}) => db.collection('users').countDocuments()
        },
        getProps: {
            type: GraphQLList(GraphQLString),
            resolve: (_, args, {db}) => Object.keys(db)
        }
    }
});
const schema = new GraphQLSchema({
   query: queryType
});

module.exports = schema;

/**
 * resolver function argument definition
 * 
 * resolve(parent, args, {db})
 * 
 * parent: get passes from the graphql function, same as the third argument of graphql() i.e rootValue 
 * args: object whose properites are the arguments passed by the client its the query.
 * {db}: get passed from the graphql  function, same as the fourth argument of the  graphql() i.e contextValue
 */


/** GraphQL arguments deefined
*
* graphql(schema, query, rootValue, contextValue)
*
* schema: is the json object holding the fields the client and query
* query: is the json object passed by the client as a query
* rootValue: get passed as the first argument to the resolver functions on the top level fields
* contactValue: global object which GraphQL engine passes to all the resolver functions as their third  argument.
*/