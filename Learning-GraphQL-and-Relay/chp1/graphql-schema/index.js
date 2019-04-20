const { graphql } = require('graphql');
const readline = require('readline');
const mySchema = require('./schema/main');

const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readLineInterface.question('Client Request: ',  inputQuery => {
    graphql(mySchema, inputQuery).then(result => {
        console.log('Server Answer: ', result.data);
    });
    readLineInterface.close();
});

/***
 * Running the script will look like this
 * Example 1
 * $ node index.js
 * Client Request: {city}
 * Server Answer: {city: 'Cape Town'} 
 * 
 * Example 2
 * $ node index.js
 * Client Request: {rollDice}
 * Server Answer: {rollDice: [6, 4]}
 * 
 * Example 3
 * $ node index.js
 * Client Request: {rollDiceWithArg(count: 5)}
 * Server Answer:   { rollDiceWithArg: [ 6, 5, 4, 1, 5 ] }
 */