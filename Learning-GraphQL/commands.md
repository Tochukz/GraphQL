# Learning GraphQL
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
