const admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://breaddit-885b4.firebaseio.com"
});