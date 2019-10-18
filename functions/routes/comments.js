const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

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