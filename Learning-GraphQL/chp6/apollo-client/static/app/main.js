import ApolloClient, {gql} from 'apollo-boost';

const client =  new ApolloClient({uri: 'http://localhost:4000/graphql'});

const query = gql`{
    allUsers{
        id
        name
        avatar
    }
}`;
/* The gql function is used to parse a query into an AST or abstract syntax tree. */

client.query({query})
      .then(({data}) => {
        let content = '';
        data.allUsers.map(user => {
          content += `<p><img src=${user.avatar} width="100"/></p>
                  <p>${user.name}`;
        })
        document.getElementById('content').innerHTML = content;
      })
      .catch(console.error);

/* Taking a look at cached response in local memory using clinet.extract() */
//console.log('cache', client.extract())


/**
 * Apollo Client is used to handle all network requests to our GraphQL service.
 * Additionally, by default, it automatically caches the results locally and defers to the local cache to improve our applications performance.
 */
