import React from 'react';
import Users from './Users';
import {BrowserRouter} from 'react-router-dom';
import {gql, InMemoryCache} from 'apollo-boost';
import AuthorizedUser from './AuthorizedUser';

export const ROOT_QUERY = gql `
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;


const App = () => 
  <BrowserRouter>
    <div>
      <AuthorizedUser />
      <Users />
    </div>
  </BrowserRouter>

/**
 *
 const cache = new InMemoryCache();

 # Reading data from cache
 let {totalUsers, allUsers, me} = cache.readQuery({query: ROOT_QUERY})
 
 # Writing to cache (Here we are clearing all data from our cache and resetting default values for all of the fields)
 # This willtrigger a UI update and clear the entire list of  users from the current DOM.
 cache.writeQuery({
   query: ROOT_QUERY,
   data: {
     me: null,
     allUsers: [],
     totalUsers: 0
   }
 })

 *
 */
export default App;


