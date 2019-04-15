const {graphql} = require('graphql');
const {MongoClient} = require('mongodb');
const readline = require('readline');
const assert = require('assert');
const schema = require('./schema/main');

const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/* 
//This variable should be set as a Node process environment variable using the export command
const MONGO_URL = 'mongodb://127.0.0.1:27017/test';

//Not working at the moment
MongoClient.connect(MONGO_URL, {useNewUrlParser: true}, (err, db) => {
    assert.equal(null, err);
    console.log("Connection to MongoDB is successful\n")
     
    // console.log("collection" in db) // See if db has 'collection' property or method
    // console.log(Object.keys(db)); // See all properties/methods of db

    readLineInterface.question('Client Request: ', inputQuery => {
        graphql(schema, inputQuery, {}, {db}).then(result => {
            console.log('Server Answer: ', result.data);
            db.close(() => readLineInterface.close())
        });
    });
});
*/

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new MongoClient(url, {useNewUrlParser: true});
client.connect(function(err) {
    assert.equal(null, err);
    console.log("connected successfully to MongoDB Server!");
    const db = client.db(dbName);
    readLineInterface.question('Client Request: ', inputQuery => {
        graphql(schema, inputQuery, {}, {db}).then(result => {
            console.log('Server Answer: ', result.data);
            client.close(() => readLineInterface.close());
        });
    });
});

/** GraphQL arguments deefined
*
* graphql(schema, query, rootValue, contextValue)
*
* schema: is the json object holding the fields the client and query
* query: is the json object passed by the client as a query
* rootValue: get passed as the first argument to the resolver functions on the top level fields
* contactValue: global object which GraphQL engine passes to all the resolver functions as their third  argument.
*/