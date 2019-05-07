const express = require('express');
const path = require('path');


app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
   res.send('Welcome to Express Static Site');
});


app.listen(app.get('port'), () => console.log(`Server is running @ localhost:${app.get('port')}`));