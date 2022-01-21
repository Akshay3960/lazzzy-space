const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require('cors');
const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const app = express();

dotenv.config()
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }))

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));

app.use('/api/items', items);
app.use('/api/users',users);
app.use('/api/auth', auth);
const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
