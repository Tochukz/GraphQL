require('dotenv').config();
const express = require('express');
const path = require('path');

const app = new express();

app.use(express.static(path.join(__dirname, 'react-app/public')));
app.use((req, res, next) => {
    res.header('X-CLIENT-ID', process.env.CLIENT_ID);
    return next();
});

app.get('/home', (req, res, next) => {
    res.send('Welcome');
});


app.listen({port: process.env.PORT}, () => console.info(`Server is running on port:${process.env.PORT}`))