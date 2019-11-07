const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

const Comment = require("../models/comment");

/**
 * Writes a Comment.
 */
router.post('/', async (req, res) => {
  // Creates a Comment entry
  let entry = new Comment();
  entry.author = req.body.author;
  entry.body = req.body.body;
  entry.karma = 0;

  // Get a database reference to our comments
  var ref = db.ref('/comments');
  let key = await ref.push(entry).then((snapshot) => {
    return snapshot.key;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });

  let userComment = db.ref(`/users/${entry.author}/comments/${key}`);
  userComment.set(true).then(() => {
    res.status(200).send(entry);
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Gets multiple Comments.
 */
router.post('/', (req, res) => {
  // #TODO: Implement
});

/**
 * Gets a specific Comment.
 */
router.get('/:_id', (req, res) => {
  // Get a database reference to a comment
  var ref = db.ref('/comments/' + req.params._id);
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Deletes a specific Comment.
 */
router.delete('/:_id', (req, res) => {
  // Get a database reference to a comment
  var ref = db.ref('/comments/' + req.params._id);
  ref.remove().then(() => {
    res.status(200).send();
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Updates a specific Comment.
 */
router.put('/:_id', async (req, res) => {
  // Prevent these from ever getting processed.
  delete req.body.karma;

  // Gets the entry
  var ref1 = db.ref('/comments/' + req.params._id);
  var entry = await ref1.once('value').then(snapshot => snapshot.val()).catch(error => {
    console.error(error);
    res.status(500).send();
    return null;
  });

  // Prevent these from ever getting processed.
  delete entry.karma;

  // Updates entry with updated values.
  let existing_keys = Object.keys(entry);
  Object.keys(req.body).forEach(key => {
    if (existing_keys.includes(key)) {
      entry[key] = req.body[key];
    }
  });

  // Updates the entry
  var ref2 = db.ref('/comments/' + req.params._id);
  ref2.update(entry).then(() => {
    res.status(200).send(entry);
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

module.exports = router;