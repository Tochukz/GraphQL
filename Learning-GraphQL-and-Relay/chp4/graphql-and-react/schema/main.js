const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLString, GraphQLList} = require('graphql');

const QuoteType = new GraphQLObjectType({
    name: 'Quote',
    fields: {
        _id: {
            type: GraphQLID            
        },
        id: {
            type: GraphQLString,
            resolve: obj => obj._id
        },
        text: {
            type: GraphQLString
        },
        author: {
            type: GraphQLString
        }
        
    }
});

const QueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        quoteCount: {
            type: GraphQLInt,
            resolve: (source, args, {db}) => db.collection('users').countDocuments()
        },
        allQuotes: {
            type: new GraphQLList(QuoteType),
            description: 'A list of quote collection.',
            resolve: (source, args, {db}) => db.collection('quotes').find().toArray()
        }
    }
});

const schemaType = new GraphQLSchema({
    query: QueryType
});

module.exports = schemaType;