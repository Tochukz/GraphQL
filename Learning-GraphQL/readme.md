# Learning GraphQL (2018)
__By Eve Porcello and Alex Banks__  
[GitHub Code](https://github.com/moonhighway/learning-graphql/)  
[Implementation of GraphQL Spec for JavaScript](https://github.com/graphql/graphql-js)

## Chapter 1: Welcome to GraphQL  
GraphQL is a query language for your APIs. It’s also a runtime for fulfilling queries with your data. The GraphQL service is transport agnostic but is typically served over HTTP.

You try the GraphQL query on the Star Wars GraphQL API [SWAPI](https://graphql.org/swapi-graphql)
```js
query {
  person(personID: 5) {
    name
    birthYear
    created
  }
}
```
Whenever a query is executed against a GraphQL server, it is validated against a type system. Every GraphQL service defines types in a GraphQL schema.  
GraphQL is often referred to as a declarative data-fetching language.

__The GraphQL Specification__  
GraphQL is a specification (spec) for client-server communication.
The spec describes the language and grammar you should use when writing queries. It also sets up a type system plus the execution and validation engines of that type system.

__REST Drawbacks__
1. Overfectching
2. Underfetching

Setting up a GraphQL endpoint that fetches data from REST endpoints is a perfectly valid way to use GraphQL. It can be a great way to incrementally adopt GraphQL at your organization.

__GraphQL Clients__  
There are many GraphQL clients, but the leaders in the space are _Relay_ and _Apollo_.   
_Relay_ is Facebook’s client that works with React and React Native.
_Apollo_ Client supports all major frontend
development platforms and is framework agnostic.  

## Chapter 2: Graph Theory

## Chapter 3. The GraphQL Query Language
__Query__
You can send a query to a GraphQL endpoint using curl
```bash
curl https://snowtooth.herokuapp.com -H 'Content-Type: application/json' --data '{"query": "{ allLifts { name }}"}' | jq .
```
 In the curl operation above the actual graphQL query is seen on the post database
 ```js
{
  allLifts {
    name
  }
}
 ```
 To send the same query to the GraphQL API using Postman, you send a POST request with _application/json_ header and the following JSON body
 ```json
 {
     "query": "{ allLifts { name }}"
 }
 ```

 __Mutations__  
 To modify data, we can send mutations
 ```js
mutation {
  setLiftStatus(id: "panorama" status: OPEN) {
    name
    status
  }
}
 ```
 The above mutation can also be sent using curl
 ```bash
curl https://snowtooth.herokuapp.com -H 'Content-Type: application/json' --data '{"query": "mutation { setLiftStatus(id: \"panorama\" status: OPEN) { name status } }"}' | jq .
 ```
To send the same mutation to the GraphQL API using Postman, you send a POST request with _application/json_ header and the following JSON body
```json
{
    "query": "mutation { setLiftStatus(id: \"panorama\" status: OPEN) { name status } }"
}
```

__JQ CLI Utility__   
In the above curl operations we used the `jq` CLI utility.  
You can install `jq`, a JSON processor CLI utility, on you machine if you have not already done so
```bash
# For Macos
$ brew install jq
# For Linux
$ sudo apt-get install jq
```
You can download the Windows executable for `jq` from the official website: [jq releases](https://jqlang.github.io/jq/download/)

### GraphQL API Tools
The two most popular tools for testing GraphQL queries against a GraphQL API are
1. GraphiQL
2. GraphQL Playground


## Chapter 4  
Instead of looking at your APIs as a collection of REST endpoints, you are going to begin looking at your APIs as collections of types.  
You need to formally define the types that your API will expose. This collection of types is called a schema.  

## Chapter 5
__Install apollo-server adn graphql__  
`$ npm install apollo-server graphql`   

__Remove apollo-server__  
`$ npm remove apollo-server`  

__Install apollo-server-express and express__  
`npm install apollo-server-express express`  

__Install GraphQL playground middleware__  
` $npm install graphql-playground-middleware-express --save-dev`  

### CONTEXT
Context is the location where you can store global values that any resolver can access. Context is a good place to store authentication information, database details,
local data caches, and anything else that is needed to resolve a GraphQL operation.

__Install mongodb__  
`$ npm install mongodb --save`    

__Install dotenv__
`$ npm install dotenv`

__Install graphql-request__    
`$ npm install graphql-request`    

## Chapter 6
__Install webpack and babel__  
`$ npm install webpack webpack-cli --save-dev`  
`$ npm install babel-loader @babel-core @babel-preset/env  --save-dev`

__Install babel-preset-react__  
`$ npm install @babel/preset-react --save-dev`  

__Install react and react-dom__  
`$ npm install react react-dom --save`  

__Install cors package__  
`$ npm install cors --save`  

#### To configure Apollo Client on React App
1. __Install create-react-app react cli globally__  
`$ npm install -g create-react-app`  

2. __Create React project__  
`$ create-react-app photo-share-client`  

3. __Install graphql, apollo-boast and react-apollo__  
`$ yarn add graphql apollo-boost react-apollo`  

__Install react-router-dom__  
`$ yarn  add react-router-dom`  

__Install apolo-cache-persist__  
`$ yarn add apollo-cache-persist`  

## Chapter 7
Apollo Server already supports subscriptions. It wraps a couple of npm packages that are routinely used to set up WebSockets in GraphQL applications: _graphql-subscriptions_ and _subscriptions-transport-ws._  By default, Apollo Server sets up a WebSocket at ws://localhost:4000.  

__Adding the WebsocketLink to the client app__   
`$ yarn add apollo-link-wp apollo-utilities`     
