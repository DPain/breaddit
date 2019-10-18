const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

let router = express.Router();

router.get('/comments', (req, res) => {
  // #TODO: implement
});

router.get('/karma', (req, res) => {
  // #TODO: Implement
});

router.get('/posts', (req, res) => {
  // #TODO: Implement
});

router.post('/rename', (req, res) => {
  // #TODO: Implement
});



module.exports = router;