const admin = require("firebase-admin");
const express = require('express');

admin.initializeApp();

let router = express.Router();

router.get('/posts', (req, res) => {
  // #TODO: implement
});


module.exports = router;