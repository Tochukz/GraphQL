import {request} from 'graphql-request';

//const url = `${window.origin}/graphql`; //For same origin requests
const url = 'http://localhost:4000/graphql'; 
const query = `
  query listUsers {
      allUsers {
          name
          avatar
      }
  }
`;

const mutation = `
  mutation populate($count: Int!) {
      addFakeUsers(count: $count) {
        githubLogin
        name
      }
  }
`;

const variables = {count: 1};

window.getUsers = function() {
    request(url, query)
    .then(res => {
        let people = '';
        res.allUsers.forEach((user, index) => {
            people += `<div class="user">
                         <h4>${index+1}</h4>
                         <p><strong>Name:</strong> ${user.name}</p>
                         <p>
                           <img src="${user.avatar}" width="100" /><br />
                           <strong>Avatar</strong>
                         </p>
                       </div>`
        });
        document.getElementById('content').innerHTML = people;
    })
    .catch(err => console.error(err));
}

window.addUsers = function() {
    request(url, mutation, variables)
    .then(res => {
        let  users = '';
        res.addFakeUsers.forEach(user => {
            users += `<div style="border: solid 1px #3CAAD9">
                        <p><strong>Github Login:</strong> ${user.githubLogin}</p>
                        <p><strong>Name:</strong> ${user.name}</p>
                      </div>
                      `;
        })
        document.getElementById('content').innerHTML = users;
    });
}