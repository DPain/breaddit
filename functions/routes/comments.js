const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

router.post('/delete', (req, res) => {
  // #TODO: implement
});

router.post('/write', (req, res) => {
  // #TODO: Implement
});

router.post('/edit', (req, res) => {
  // #TODO: Implement
});

module.exports = router;