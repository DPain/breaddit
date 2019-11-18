const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fb = require('./firebase');
const verifyToken = require('./auth');

const app = express();

var whitelist = ['http://localhost', 'https://breaddit-885b4.firebaseapp.com', 'https://breaddit-885b4.web.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// Debug only.
//app.use(cors('*'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

// Routes
const posts = require('./routes/posts');
const profile = require('./routes/profile');
const subreddit = require('./routes/subreddit');
const comments = require('./routes/comments');
const karma = require('./routes/karma');

/**
 * Exposed APIs
 */
app.use('/posts', verifyToken, posts);
app.use('/profile', verifyToken, profile);
app.use('/subreddit', verifyToken, subreddit);
app.use('/comments', verifyToken, comments);
app.use('/karma', verifyToken, karma);

// End of exposed API.

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);