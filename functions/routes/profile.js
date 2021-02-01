const Router = require("express");
const fb = require("../firebase");
const db = fb.database();

let router = Router();

/**
 * Gets all information about yourself.
 */
router.get("/", (req, res) => {
  var ref = db.ref(`/users/${req.body.uid}`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Gets all information of a user
 */
router.get("/:_id", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Gets all comments made by a user
 */
router.get("/:_id/comments", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}/comments`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Gets all karma made by a user
 */
router.get("/:_id/karma", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}/karma`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Gets all posts made by a user
 */
router.get("/:_id/posts", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}/posts`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * get name
 */
router.get("/:_id/name", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}/name`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Rename yourself
 */
router.post("/rename", (req, res) => {
  let uid = req.body.uid;
  let name = req.body.name;

  var ref = db.ref(`/users/${uid}/name`);
  ref
    .set(name)
    .then(() => {
      res.status(200).send();
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Add profile pic
 */
router.post("/pfp", (req, res) => {
  let uid = req.body.uid;
  let pfp = req.body.pfp;

  var ref = db.ref(`/users/${uid}/pfp`);
  ref
    .set(pfp)
    .then(() => {
      res.status(200).send();
      return;
    })
    .catch((error) => {
      res.status(500).send();
    });
});

/**
 * Get profile pic
 */
router.get("/:_id/pfp", (req, res) => {
  var ref = db.ref(`/users/${req.params._id}/pfp`);
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

module.exports = router;
