const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

let router = express.Router();

router.post('/up', (req, res) => {
  // #TODO: implement
});

router.post('/down', (req, res) => {
  // #TODO: Implement
});

module.exports = router;