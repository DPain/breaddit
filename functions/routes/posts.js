const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

const Post = require("../models/post");

/**
 * Gets a list of Posts
 */
router.get('/', (_, res) => {
  // Get a database reference to our posts
  var ref = db.ref('/posts');
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return null;
  }).catch(error => {
    console.error(error);
    res.error(500);
  });
});

/**
 * Writes a Post.
 */
router.post('/', (req, res) => {
  // Creates a Post entry
  let entry = new Post();
  entry.author = req.body.uid;
  entry.body = req.body.body;
  entry.comments = [];
  entry.karma = 0;
  entry.subreddit = req.body.subreddit;
  entry.title = req.body.title;

  // Get a database reference to our posts
  var ref = db.ref('/posts');
  ref.push(entry).then(() => {
    res.status(200).send(entry);
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Gets a specific Post.
 */
router.get('/:_id', (req, res) => {
  // Get a database reference to a post
  var ref = db.ref('/posts/' + req.params._id);
  
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Deletes a specific Post.
 */
router.delete('/:_id', (req, res) => {
  // Get a database reference to a post
  var ref = db.ref('/posts/' + req.params._id);
  ref.remove().then(() => {
    res.status(200).send();
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Updates a specific Post.
 */
router.put('/:_id', async (req, res) => {
  // Prevent these from ever getting processed.
  delete req.body.comments;
  delete req.body.karma;

  // Gets the entry
  var ref1 = db.ref('/posts/' + req.params._id);
  var entry = await ref1.once('value').then(snapshot => snapshot.val()).catch(error => {
    console.error(error);
    res.status(500).send();
    return null;
  });

  // Prevent these from ever getting processed.
  delete entry.comments;
  delete entry.karma;

  // Updates entry with updated values.
  let existing_keys = Object.keys(entry);
  Object.keys(req.body).forEach(key => {
    if (existing_keys.includes(key)) {
      entry[key] = req.body[key];
    }
  });

  // Updates the entry
  var ref2 = db.ref('/posts/' + req.params._id);
  ref2.update(entry).then(() => {
    res.status(200).send(entry);
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

module.exports = router;