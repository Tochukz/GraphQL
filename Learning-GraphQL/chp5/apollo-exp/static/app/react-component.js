import React from 'react';
import ReactDOM from 'react-dom';
import {request} from 'graphql-request';

const url = `${window.origin}/graphql`;

const query = `
  query listUsers {
      allUsers {
          avatar
          name
      }
  }
`;

var mutation = `
    mutation populate(count: Int) {
        githubLogin
    }
`;

const App = ({users = []}) => 
    <div>
       {
           users.map(user => 
              <div key={user.githubLogin}>
                 <img src={user.avatar} alt="" />
              </div>
            )
       }
       <button onClick={addUser}>Add User</button>
    </div> 

const render = ({ allUsers = []}) =>
     ReactDOM.render(
         <App users={allUsers} />, document.getElementById('root')
     );

const addUser = () => 
      request(uel, mutation, {count: 1})
      .then(render)
      .catch(err => console.error(err));

const renderUsers = () => 
      request(url, query)
      .then(render)
      .catch(err => console.error(err));

//requestAndRender();

module.exports = {renderUsers, addUser};