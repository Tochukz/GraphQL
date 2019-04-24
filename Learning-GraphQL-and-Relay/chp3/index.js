const express = require('express');
const graphqlHTTP = require('express-graphql');
const mySchema = require('./schema/main');
const people = require('./data/people');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    context: {people},
    graphiql: true
}));

app.listen(3000, () => console.log("Server running on port 3000"));