# Learning GrapHQL and Relay
### Installing JavaScript implementation of GraphQL
`npm install graphql ---save`  

### Use export command to set environment variables
Setting mongodb environment variable  
`$ export MONGO_URL=mongodb://localhost:27017/test`  
Then in the Node code, you can tread the exported value by using this:  
`process.env.MONGO_URL`  
### Installing Express.js and express-graphql middleware package in one go
`$ npm install express express-graphql --save`  
## To  setup webpack and babel for react
* Intsall webpack  
`$ npm install webpack --save-dev`  
* Install webpack-cli  
`$ npm install webpack-cli --save-dev`  
* Add a script for webpack in package.json
```
"script": {
  "build": "webpack-cli --mode production",
  "watch": "webpack-cli --mode development --watch" 
}
```
* Install all babel-loaders and all required presets
`npm i babel-loader @babel/core  @babel/preset-env @babel/preset-react "@babel/plugin-proposal-class-properties --save-dev`  
* Create the .babel.rc file to configure babel.  
```
{
    "presets" : [
      "@babel/preset-env", 
      "@babel/preset-react"
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties"
    ]
}
```
* Create the webpack.config.js file and define the webpack configuration.
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
@babel/core must be used when using babel-loader@8 which seem to be the latest version at the time of this writing.  
* Install React and ReactDOM    
`$ npm install react react-dom --save`  
* Run the webpack-cli from the root of your project where the webpack.config.js lives
`$ webpack-cli`  
