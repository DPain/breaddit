const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

// Gets a list of Subreddits
router.get('/', (req, res) => {
  var ref = db.ref('/subreddit');
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

// Gets hasPosts value
router.get('/:_id/hasPosts', (req,res) => {
  var ref = db.ref(`/subreddit/${req.params._id}/hasPosts`);
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

// Gets list of Subreddit posts
router.get('/:_id/posts', (req,res) => {
  var ref = db.ref(`/subreddit/${req.params._id}/posts`);
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

// Creates a Subreddit.
router.post('/', (req, res) => {
  // #TODO: Only allow users with role: admin to create subreddit.

  let name = req.body.name;

  // Get a database reference to our posts
  var ref = db.ref(`/subreddit/${name}`);
  ref.set({hasPosts: false}).then(() => {
    res.status(200).send();
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});

// Deletes a Subreddit.
router.delete('/', (req, res) => {
  // #TODO: Only allow users with role: admin to create subreddit.

  let name = req.body.name;

  // Searches through list of subreddits and gets the key for that specific subreddit.
  var ref = db.ref('/subreddit');
  ref.orderByValue().equalTo(name).limitToFirst(1).once('value', (snapshot) => {
    if (snapshot.val() !== null) {
      let key = Object.keys(snapshot.val())[0];

      ref.child(key).remove().then(() => {
        // Deleted subreddit.
        res.status(200).send();
        return
      }).catch(error => {
        console.error(error);
        res.status(500).send();
      });
    } else {
      // No results found!
      res.status(404).send();
    }
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});


module.exports = router;