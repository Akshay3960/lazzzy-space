require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const list = require('./routes/api/list')
const upload = require('./routes/api/upload')
const board = require('./routes/api/boards')
const notify = require('./routes/api/notify')
const refresh = require('./routes/api/refresh')
const connectDB = require('./config/dbConn')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const verifyJWT = require('./middleware/verifyJWT')
const app = express();
const PORT = process.env.PORT || 5000;

//Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement, needed to check client as per 
// CORS policy
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions))

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser()); 

//Set static file path
app.use('/images', express.static(__dirname + '/images'));

app.use('/api/refresh', refresh);
app.use('/api/auth', auth);

// Check for access token before any request.
app.use(verifyJWT);
app.use('/api/users', users);
app.use('/api/list', list);
app.use('/api/upload', upload);
app.use('/api/boards', board);
app.use('/api/notify', notify);

//Listen through PORT only if mongoDB connection is `open`
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
