const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => console.log(`Static Server is running @ localhost:${app.get('port')}`));