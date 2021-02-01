const Router = require("express");
const fb = require("../firebase");
const db = fb.database();

let router = Router();

const Post = require("../models/post");

/**
 * Gets a list of Posts
 */
router.get("/", (_, res) => {
  // Get a database reference to our posts
  var ref = db.ref("/posts");
  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return null;
    })
    .catch((error) => {
      console.error(error);
      res.error(500);
    });
});

/**
 * Writes a Post.
 */
router.post("/", async (req, res) => {
  // Creates a Post entry
  let entry = new Post();
  entry.authorid = req.body.uid;
  entry.body = req.body.body;
  entry.subreddit = req.body.subreddit;
  entry.title = req.body.title;
  entry.author = req.body.name;

  // Get a database reference to our posts
  var ref = db.ref("/posts");
  let key = await ref
    .push(entry)
    .then((snapshot) => {
      return snapshot.key;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });

  var breadditPost = db.ref(`/subreddit/${entry.subreddit}/posts/${key}`);
  breadditPost.set(entry);

  var breadditHasPosts = db.ref(`/subreddit/${entry.subreddit}/hasPosts`);
  breadditHasPosts.set(true);

  var userPost = db.ref(`/users/${req.body.uid}/posts/${key}`);
  userPost
    .set(entry)
    .then(() => {
      res.status(200).send(entry);
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Gets a specific Post.
 */
router.get("/:_id", (req, res) => {
  // Get a database reference to a post
  var ref = db.ref("/posts/" + req.params._id);

  ref
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
      return null;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

/**
 * Deletes a specific Post.
 */
router.delete("/:_id", (req, res) => {
  var userRef = db.ref(`/users/${req.body.uid}/posts/${req.params._id}`);
  userRef.remove();

  var breadditRef = db.ref(
    `/subreddit/${req.body.breaddit}/posts/${req.params._id}`
  );
  breadditRef.remove();

  // Get a database reference to a post
  var ref = db.ref("/posts/" + req.params._id);
  ref
    .remove()
    .then(() => {
      res.status(200).send();
      return null;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});
/*
router.post('/numChange', (req, res) => {
  let pid = req.body.pid;
  let num = req.body.num;

  var ref = db.ref(`/posts/${pid}/numOfComments`);
  ref.set(num).then(() => {
    res.status(200).send();
    return
  }).catch(error => {
    console.error(error);
    res.status(500).send();
  });
});*/

/**
 * Updates a specific Post.
 */
router.put("/:_id", async (req, res) => {
  // Prevent these from ever getting processed.
  delete req.body.comments;
  delete req.body.karma;

  // Gets the entry
  var ref1 = db.ref("/posts/" + req.params._id);
  var entry = await ref1
    .once("value")
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error(error);
      res.status(500).send();
      return null;
    });

  // Prevent these from ever getting processed.
  delete entry.comments;
  delete entry.karma;

  // Updates entry with updated values.
  let existing_keys = Object.keys(entry);
  Object.keys(req.body).forEach((key) => {
    if (existing_keys.includes(key)) {
      entry[key] = req.body[key];
    }
  });

  // Updates the entry
  var ref2 = db.ref("/posts/" + req.params._id);
  ref2
    .update(entry)
    .then(() => {
      res.status(200).send(entry);
      return null;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

module.exports = router;
