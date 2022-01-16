const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const items = require('./routes/api/items');
const users = require('./routes/api/users');
const app = express();

app.use(bodyParser.json());


const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));

app.use('/api/items', items);
app.use('/api/users',users);

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
