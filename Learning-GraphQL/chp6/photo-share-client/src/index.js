import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {ApolloProvider} from 'react-apollo';
import ApolloClient from 'apollo-boost';


const client = new ApolloClient({uri: 'http://localhost:4000/graphql'});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

/**
 * Here, we’ve created a client and then placed that client in React’s global scope with the help of a component called the ApolloProvider. 
 * Any child component wrapped by the ApolloProvider will have access to the client.
 */