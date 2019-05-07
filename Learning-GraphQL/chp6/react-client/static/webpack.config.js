const path = require('path');

module.exports = {
  mode: "development",
  entry: "./app/main.js",
  output: {
    path: path.join(__dirname, '../public/js'),
    filename: 'bundle.js'
  },
  module: {
     rules: [
       {
           test: /\.(js|jsx)$/,
           exclude:  /node_modules/,
           use: {
              loader: "babel-loader"
           }
       }
    ]
  }
};
