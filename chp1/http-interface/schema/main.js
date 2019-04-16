const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt} = require('graphql');

const queryType = new GraphQLObjectType({
    name: "User",
    fields: {
        // person: {
        //     type: GraphQLObjectType,
        //     args:{
        //         name: {
        //             type: GraphQLString,
        //             defaultValue: 'chichi'
        //         }
        //     },
        //     resolve: (_, args, {db}) => db.collection.findOne({name: args.name})
        // }
        peopleCount: {
            type: GraphQLInt,
            resolve: (_, args, {db}) => db.collection('people').countDocuments()
        },
        // names: {
        //     type: new GraphQLList(GraphQLString),
        //     resolve: (_, args, {db}) => db.collection('people').find({}, {name: 1, _id: 0})                         
        // },
        // cities: {
        //     type: new GraphQLList(GraphQLString),
        //     resolve: (_, args, {db}) => db.collection('people').find({}, {city: 1, _id: 0}).toArray()
        // }

    }
});

const personSchema = new GraphQLSchema({
    query: queryType
});

module.exports = personSchema;

/**
 * Make a request with a URL query string as follows:
 * http://localhost:3000/graphql?query={peopleCount}
 */