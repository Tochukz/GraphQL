const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt} = require('graphql');
const employees = require('../data/employees');

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: {
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      }
    }
});

const Person = new GraphQLObjectType({
    name: 'Person',
    fields: {
      name: {
        type: GraphQLString
      },
      city: {
        type: GraphQLString
      }
    }
});

const Name = new GraphQLObjectType({
  name: 'Name',
  fields: {
    name: {
      type: GraphQLString
    }
  }
});

const queryType = new GraphQLObjectType({
    name: "User",
    fields: {
        peopleCount: {
            type: GraphQLInt,
            resolve: (_, args, {db}) => db.collection('people').countDocuments()
        },
        person: {
            type: Person,
            args:{
                name: {
                    type: GraphQLString,
                    defaultValue: 'chichi'
                }
            },
            resolve: (_, args, {db}) => db.collection('people').findOne({name: args.name}, {_id: 0})
        },
        names: {
            type: new GraphQLList(Name),
            resolve: (_, args, {db}) => db.collection('people').find({}, {name: 1, _id: 0}).toArray()
        },
        employee: {
          type: EmployeeType,
          args: {
            employeeId: {
              type: GraphQLInt,
              defaultValue: 1
            }
          },
          resolve: (source, args) => employees[args.employeeId]
        }

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

/**
 * Example query for all the fields defined in the schema personSchema above:
 *
 {
    peopleCount
    employee(employeeId: 2) {
      firstName
      lastName
    }
    person(name: "Chukwudi"){
      name
      city
    }
    names{
      name
    }
}
*
*/
