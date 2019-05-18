import React from 'react';
import {Query, Mutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import {ROOT_QUERY} from './App';

const ADD_USERS_MUTATION = gql`
    mutation addUsers($count: Int!) {
        addFakeUsers(count: $count) {
            githubLogin            
            name
            avatar

        }
    }
`

const Users = () => 
  <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
    {({data, loading, refetch}) => loading?
      <p>loading users...</p> :
      <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
    }
  </Query>

const UserList = ({count, users, refetchUsers}) => 
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch Users</button>
    <Mutation mutation={ADD_USERS_MUTATION} variables={{count: 1}} update={updateUserCache}>
      {addUsers =>
        <button onClick={addUsers}>Add Fake Users</button>
      }
    </Mutation>
    <ul>
      {users.map(user =>
        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />  
      )}
    </ul>
  </div>

export default Users;

const UserListItem = ({name, avatar}) => 
  <li>
    <img src={avatar} with={48} height={48} alt="" />
    {name}
  </li>

const updateUserCache = (cache, {data: {addUsers}}) => {
  let data = cache.readQuery({query: ROOT_QUERY});
  data.totalUsers += addUsers.length;
  data.allUsers = [
    ...data.allUsers,
    ...addUsers
  ];
  cache.writeQuery({query: ROOT_QUERY, data});
  //Replacing the data in the cache will cause the UI to update and display the new fake user.
}
/**
 * Under the hood, the Query component is sending the ROOT_QUERY to our GraphQL service and caching the result locally. 
 * We obtain the result using a React technique called render props. Render props allow us to pass properties as function arguments to child components.
 */

 /**
  * <Query query={ROOT_QUERY} pollInterval={1000} fetchPolicy="cache-only">
  * In addition to looading, data and refetch, the response object has some addiional options:
  * 
  * stopPolling
  *     A function that stops polling
  * startPollinng
  *     A function that will start polling
  * fetchMore
  *     A function that can be used to fetch the next page of data
  * 
  * 
  * <Mutation mutation={ADD_USERS_MUTATION} variables={{count: 1}} refetchQueries={[{query: ROOT_QUERY}]}>
  * </Mutation>
  */


 