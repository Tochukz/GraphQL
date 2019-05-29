import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Mutation, Query, withApollo, compose} from 'react-apollo';
import {gql} from 'apollo-boost';
import {ROOT_QUERY} from './App';

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
      githubAuth(code: $code) {token}
  }
`;

const Me = ({logout, requestCode, signingIn}) =>
  <Query query={ROOT_QUERY}>
    {({loading, data}) => data.me?
      <CurrentUser {...data.me} logout={logout} /> :
      loading ? 
        <p>loading</p> : 
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
    }
  </Query>

const CurrentUser = ({name, avatar, logout}) =>
  <div>
    <img src={avatar} with={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>Logout</button>
  </div>

class AuthorizedUser extends Component {
    state = { signingIn: false}

    authorizationComplete= (cache, {data}) => {
        localStorage.setItem('token', data.githubAuth.token);
        this.props.history.replace('/');
        this.setState({signingIn: false});
    }

    componentDidMount() {
        if (window.location.search.match(/code=/)) {
            this.setState({signingIn: true});
            const code = window.location.search.replace("?code=", ""); //alert(code);
            this.githubAuthMutation({variables: {code}});
        }
    }

    requestCode() {
        var clientID = '<APP-CLIENT-KEY-HERE>'; //Replace this with a more efficent method
        window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
    }
       
    render() {
        return (
            <Mutation mutation={GITHUB_AUTH_MUTATION} update={this.authorizationComplete} 
              refetchQueries={[{query: ROOT_QUERY}]}>
              {mutation => {
                  this.githubAuthMutation = mutation;
                  return (                   
                    <Me signingIn={this.state.signingIn} requestCode={this.requestCode} 
                      logout={() => {
                        localStorage.removeItem('token');
                        let data = this.props.client.readQuery({query: ROOT_QUERY});
                        data.me = null;
                        this.props.client.writeQuery({query: ROOT_QUERY, data});
                      }                  
                     } />
                  )
              }}  
            </Mutation>                          
        )
    }
}
/**
 * The Mutation component is tied to the GITHUB_AUTH_MUTATION. Once completed, it will invoke the component’s authorizationComplete method and refetch the ROOT_QUERY.
 * The mutation function has been added to the scope of the AuthorizedUser component by setting: this.githubAuthMutation = mutation.
 * We can now invoke this this.githubAuthMutation() function when we are ready (when we have a code).
 */

//export default  withRouter(AuthorizedUser);
export default compose(withApollo, withRouter)(AuthorizedUser)
/*using compose we assemble the withApoll and withRouter functions into a single function*/

/**
 * To start the authorization process, invoke this.githubAuthMutation() and add the 'code' to the operation’s variables. 
 * Once complete, the authorizationComplete method will be called. The data passed to this method is the data that we selected in the mutation. 
 * It has a token. We’ll save the token locally and use React Router’s history to remove the code query string from the window’s location bar.
 */