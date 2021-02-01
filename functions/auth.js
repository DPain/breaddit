const admin = require("firebase-admin");
const fb = require('./firebase');
const db = fb.database()

const Profile = require("./models/profile");

async function createUserProfile(uid) {
  const profile = new Profile();

  let ref = db.ref(`/users/${uid}`);
  ref
    .set(profile)
    .then(() => {
      return true;
    })
    .catch((_) => {
      return false;
    });
}

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken) {
      let uid = decodedToken.uid;

      let ref = db.ref(`/users/${uid}`);
      var profileExists = await ref
        .once("value")
        .then((snapshot) => {
          if (snapshot.val() === null) {
            return false;
          }
          return true;
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).send("Internal server error!");
        });

      if (!profileExists) {
        let success = await createUserProfile(uid);

        if (!success) {
          return res.status(500).send("Internal server error!");
        }
      }

      req.body.uid = uid;

      return next();
    } else {
      return res.status(401).send("You are not authorized!");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error!");
  }
}

module.exports = verifyToken
