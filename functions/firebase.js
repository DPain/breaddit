const admin = require("firebase-admin");

module.exports = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://breaddit-885b4.firebaseio.com"
});