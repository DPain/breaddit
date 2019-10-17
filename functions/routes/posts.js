const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

let router = express.Router();

router.get('/', (_, res) => {
  // Get a database reference to our posts
  var ref = admin.database().ref('/posts');
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return null;
  }).catch(error => {
    console.error(error);
    res.error(500);
  });
});

router.get('/:_id', (req, res) => {
  // Get a database reference to our posts
  var ref = admin.database().ref('/posts/' + req.params._id);
  ref.once('value').then((snapshot) => {
    res.status(200).send(snapshot.val());
    return null;
  }).catch(error => {
    console.error(error);
    res.error(500);
  });
});

module.exports = router;