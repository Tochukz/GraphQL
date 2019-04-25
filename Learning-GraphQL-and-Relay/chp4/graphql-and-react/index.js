const express = require('express');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const {MongoClient} = require('mongodb');
const assert = require('assert');
const schemaType = require('./schema/main.js'); 

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new MongoClient(url, {useNewUrlParser: true});
client.connect((err) => {
    assert.equal(null, err);
    const db = client.db(dbName);

    app.use('/graphql', graphqlHTTP({
        schema: schemaType,
        context: {db},
        graphiql: true
    }))

});

app.listen(3000, () => 'GraphQL Server is running on port 3000');