const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

router.post('/up', (req, res) => {
  // #TODO: implement
});

router.post('/down', (req, res) => {
  // #TODO: Implement
});

module.exports = router;