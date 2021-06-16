
const express = require('express');
const app = express();
let cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

const path = require('path');

const index_router = require('./routers/index_router');

const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session(
    {secret: 'SECRET-KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: false, secure: false, maxAge: 1000 * 60 * 60 * 72}
    }
))

app.use('/', index_router);




app.listen(PORT, () => {
    console.log(' --- SERVER UP --- ');
    console.log(' --- PORT UP [ ' + PORT + ' ] --- ');
})



