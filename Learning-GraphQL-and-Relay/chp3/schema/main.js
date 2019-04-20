const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql');

const myQuery = new GraphQLObjectType({
    name: "People",
    fields: {
        firstPerson: {
            description: "The name of the first person",
            type: GraphQLString,
            resolve: (_, args, {people})  => people[0].name
        },
        everybody: {
            description: "The names of everybody",
            type: GraphQLList(GraphQLString),
            resolve: (_, args, {people}) => people.map(person => person.name)

        }
    }
});

const mySchema = new GraphQLSchema({
    query: myQuery
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