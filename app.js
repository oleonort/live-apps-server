const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const db = require('./config/keys').MongoURI;
const jwtStrategy = require('./config/passport');
const cookieParser = require('cookie-parser');

// routers
const ioRouter = require('./routes/io');
const usersRouter = require('./routes/user');

const app = express();

// using cookies parser
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

const port = 5000;

// Start server and save ref to const fot socket io
const server  = app.listen(process.env.PORT || port, () => (
  console.log(`Server started on port ${port}`
)));

// init socket io
const io = socketio(server);

// Using routes
app.use('/io', ioRouter(io));
app.use('/api/user', usersRouter);

// TODO: remove after test is done
app.use('/heroku/test', (req, res) => {
  res.send('all good');
});

// config passport to use jwtStrategy
jwtStrategy(passport);

// init passport
app.use(passport.initialize());

// Connect to Mongo
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('db connected'))
    .catch(error => console.log(error));