const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt} = require('graphql');
const roll = () => Math.floor(Math.random() * 6) + 1;

const myQueryType = new GraphQLObjectType({
    name: 'Madu',
    fields: {
        city: {
            type: GraphQLString,
            resolve: () => 'Cape Town'
        },
        rollDice: {
            type: new GraphQLList(GraphQLInt),
            resolve: () => [roll(), roll()]
        },
        rollDiceWithArg: {
            type: new GraphQLList(GraphQLInt),
            args: {
                count: {
                    type: GraphQLInt,
                    defaultValue: 2
                }
            },
            resolve: (_, args) => {
                const rolls = [];
                for ( let i = 0; i < args.count; i++) {
                    rolls.push(roll());
                }
                return rolls;
            }
        }
    }
});

const mySchema = new GraphQLSchema({
    query: myQueryType
});

module.exports = mySchema;
