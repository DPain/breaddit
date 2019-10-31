const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

/**
 * Votes a Comment. User can only upvote or downvote once.
 */
router.post('/comment/:_id', (req, res) => {
  let id = req.param._id;
  let vote = (req.body.vote === true) ? true : false;



  // #TODO: Implement



  // Get a database reference to the user's record
  var ref = db.ref('/users/');
  ref.push(entry).then(() => {
    res.status(200).send(entry);
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

/**
 * Votes a Post. User can only upvote or downvote once.
 */
router.post('/post/:_id', (req, res) => {
  let id = req.body._id;
  let vote = (req.body.vote === true) ? true : false;

  // Get a database reference to our comments
  var ref = db.ref('/');
  ref.push(entry).then(() => {
    res.status(200).send(entry);
    return null;
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

module.exports = router;