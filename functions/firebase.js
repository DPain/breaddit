const admin = require("firebase-admin");

module.exports = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://breaddit-1ce34-default-rtdb.firebaseio.com"
});
