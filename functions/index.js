const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fb = require('./firebase');
const auth = require('./auth');

const app = express();

app.use(cors({ origin: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
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
app.use('/posts', posts);
app.use('/profile', profile);
app.use('/subreddit', subreddit);
app.use('/comments', comments);
app.use('/karma', auth.isAuthenticated, karma);

// End of exposed API.

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);