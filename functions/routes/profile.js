const express = require('express');
const fb = require('../firebase');
const db = fb.database()

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