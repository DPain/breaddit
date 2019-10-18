const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));

// Routes
const posts = require('./routes/posts');
const post_manage = require('./routes/post_manage');
const profile = require('./routes/profile');
const subreddit = require('./routes/subreddit');
const subreddit_manage = require('./routes/subreddit_manage');
const comments = require('./routes/comments');
const karma = require('./routes/karma');

/**
 * Exposed APIs
 */
app.use('/posts', posts);
app.use('/post_manage', post_manage);
app.use('/profile', profile);
app.use('/subreddit', subreddit);
app.use('/subreddit_manage', subreddit_manage);
app.use('/comments', comments);
app.use('/karma', karma);

// End of exposed API.

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);