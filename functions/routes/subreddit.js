const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

// Gets a list of Subreddits
router.get('/', (req, res) => {
  // #TODO: implement
});

// Creates a Subreddit.
router.post('/', (req, res) => {
  // #TODO: implement
});

// Deletes a Subreddit.
router.delete('/', (req, res) => {
  // #TODO: Implement
});


module.exports = router;