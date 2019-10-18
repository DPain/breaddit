const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

let router = express.Router();

router.post('/create', (req, res) => {
  // #TODO: implement
});

router.post('/delete', (req, res) => {
  // #TODO: Implement
});

module.exports = router;