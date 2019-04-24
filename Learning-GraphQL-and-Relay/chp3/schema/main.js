const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLEnumType} = require('graphql');
const fs = require('fs');
const path = require('path');

const ContractType = new GraphQLEnumType({
  name: 'ContractType',
  values: {
    FULL_TIME: {
      value: 1
    },
    PART_TIME: {
      value: 2
    }, 
    SHITFT_WORK: {
      value: 3
    }
  }
});

const LetterCaseType = new GraphQLEnumType({
    name: 'LetterCase',
    values: {
      UPPER_CASE : {
        value: 'upper_case'
      },
      LOWER_CASE: {
        value: 'lower_case'
      },
      TITLE_CASE: {
        value: 'title_case'
      }
    }
});

//Defining a promise to be used in the schema
const readFromQuotes = filePath => new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
          throw reject(err);
      }
      resolve(data.toString().trim().split("\n").slice(-1)[0]);
    })
});

const writeToQuotes = (filePath, line) => new Promise((resolve, reject) => {
    fs.appendFile(filePath, "\n" + line, err => {
        if (err) {
            throw reject(err);
        }
        resolve(line);
    });
});

//Basic used of the above defined promise
const file = path.join(__dirname, '../data/quotes.log');
readFromQuotes(file).then(data => console.log(data))
                    .catch(err => console.error(err));

const myQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        firstPerson: {
            description: "The name of the first person",
            type: GraphQLString,
            resolve: (_, args, {people})  => people[0].name
        },
        everybody: {
            description: "The names of everybody",
            deprecationReason: "Use 'names' instead",
            type: GraphQLList(GraphQLString),            
            resolve: (_, args, {people}) => people.map(person => person.name)

        },
        contractType: {
          type: ContractType,
          args: {
            personId: {
              type: GraphQLInt
            }
          },
          resolve: (source, args, {people}) => people.find( person => person.personId == args.personId).contractType
        },
        names: {
          descriptiion: "Names with case option",
          type: GraphQLList(GraphQLString),
          args: {
              letterCase: {
                type: LetterCaseType,
                defaultValue: 'TITLE_CASE' //The default does not seems to take effect in this enum type
              }
          },
          resolve: (source, args, {people}) => {
             let names = people.map(person => person.name);
             switch(args.letterCase) {
                 case 'upper_case' : 
                     names.forEach((name, index, namesArray) => {
                       namesArray[index] = name.toUpperCase();
                     }) ;                                    
                     break;
                 case 'lower_case': 
                     return names.map(name => name.toLowerCase())                                       
                 case 'title_case':
                     return names.map(name => {
                       return name.replace(/\w\S*/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase())
                     });                   
                 default: 
                     
             }
             return names;
             
          }
        },
        lastQuote: {
          type: GraphQLString,
          resolve: () => readFromQuotes(file)
          //The GraphQL executor is smart enough to see a promise returned and use its resolved value in the response for the query.
        }
    }
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addQuote: {
      type: GraphQLString,
      args: {
        body: {
          type: GraphQLString
        }
      },
      resolve: (source, args) => writeToQuotes(file, args.body)
    }
  }
})

const mySchema = new GraphQLSchema({
    query: myQuery,
    mutation: mutationType
});


module.exports = mySchema;

/**
 * To use GraphQL's introspection capability to find out about the schema and the feilds it support you can use the __type field in 
 * GrqphiQL interface. Note that 'People' is the name of a root Query.
 * 
query TypeFields {
  __type(name: "People") {
        fields {
            name
            description
            args {
                name
            }
        }
    }
}

* If you do not know the name of the root field you can use the __schema field to find it 

query QueryTypeName {
  __schema {
    queryType {
      name
    }
  }
}

* To read the list of directives a GraphQL server supports us the query

query SchemaDirective {
  __schema {
    directives {
      name
      description
      args{
        name
        description
      }
    }
  }
}

* The GraphQL JavaScript reference implementation library has a built-in introspectionQuery that we can use to ask for a complete representation of the server's type system.
* You can find this query if you search the library's GitHub repo (https://github.com/graphql/graphql-js) for introspectionQuery .
*/

/*
 * Querying for all the fields in the defined schema above.

query testQuery {
  firstPerson
  everybody
  contract : contractType(personId: 1)
  names(letterCase: TITLE_CASE)
  lastQuote
}

* Take note of the use of the alias 'contract' for the contractType field and also the use of the enum argument TITLE_CASE as a constant and not a string.
*/

/**
 * To insert using the mutation:
mutation {
  addQuote(body: "Haven help those who help themselves")
}
 */