import React from 'react';
import ReactDOM from 'react-dom';
import {request} from 'graphql-request';

//const url = `${window.origin}/graphql`;
const url = 'http://localhost:4000/graphql';

const query = `
  query listUsers {
      allUsers {
          id
          avatar
          name
      }
  }
`;

var mutation = `
    mutation populate($count: Int) {
        allUsers : addFakeUsers(count: $count){
            id
            avatar
            name
        }
    }
`;

const App = ({users = []}) =>
    <div>
       <div>
         <button onClick={renderUsers}>Show Users</button>
         <button onClick={addGithubUser}>Add User</button>
       </div>
       {
           users.map((user, index) =>
              <div key={user.id} style={{border:'solid silver 1px'}} className="person">
                 <h3>{index+1}</h3>
                 <img src={user.avatar} alt="" width="100" />
                 <h4>{user.name}</h4>
              </div>
            )
       }
    </div>

const render = ({ allUsers = []}) =>
     ReactDOM.render(
         <App users={allUsers} />, document.getElementById('root')
     );

const addGithubUser = () =>
      request(url, mutation, {count: 1})
      .then(render)
      .catch(err => console.error(err));

const renderUsers = () =>
      request(url, query)
      .then(render)
      .catch(err => console.error(err));

ReactDOM.render(<App />, document.getElementById('root'));
