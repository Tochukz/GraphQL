const express = require('express');
const graphqlHTTP = require('express-graphql');
const {MongoClient} = require('mongodb');
const assert = require('assert');
const personSchema = require('./schema/main');


const app = express();

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new MongoClient(url, {useNewUrlParser:  true});
client.connect(function(err){
    assert.equal(null, err);
    const db = client.db(dbName);
    app.use('/graphql', graphqlHTTP({
        schema: personSchema,
        context: {db},
        graphiql: true
    }));

});

app.listen(3000, () => console.info("Express app runing on port 3000"));

/**
 * Make a request with a URL query string as follows:
 * http://localhost:3000/graphql?query={peopleCount}
 *
 * Query all the fiiels in the schema directly on the browser location bar by doing
 * http://localhost:3000/graphql?query={peopleCount names{name} employee(employeeId: 2){firstName lastName} person(name: "Chukwudi"){name city}}
 *
 */
