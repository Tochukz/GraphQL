const express = require('express');
const path =  require('path');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, send) => {
   res.send('Welcome to the fetch client! <br /> <a href="${/index.html}">Index Page</a>');
});

app.listen(app.get('port'), () => `Static site server is running @ localhost:${app.get('port')}`);