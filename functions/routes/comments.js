const { Router } = require("express");
const fb = require("../firebase");
const db = fb.database();

let router = Router();

const Comment = require("../models/comment");

/**
 * Writes a Comment.
 */
router.post("/", async (req, res) => {
  // Creates a Comment entry
  let entry = new Comment();
  entry.authorid = req.body.uid;
  entry.body = req.body.body;
  entry.author = req.body.name;
  entry.path = req.body.path;
  let breaddit = req.body.breaddit;

  let path = req.body.path.split("/");
  let forRef = `/posts/${path[0]}/comments`;
  path.forEach((curr, index) => {
    if (index > 0) {
      forRef += `/${curr}/replies`;
    }
  });

  // Get a database reference to our comments
  var ref = db.ref(`/comments`);
  let key = await ref
    .push(entry)
    .then((snapshot) => {
      return snapshot.key;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });

  let postRef = db.ref(`${forRef}/${key}`);
  postRef.set(entry);

  //attempt to set num of comments for post
  let forNumRef = forRef.substring(0, forRef.length - 8);
  var numRef = db.ref(`/posts/${path[0]}/numOfComments`);
  numRef.transaction((current_value) => {
    return (current_value || 0) + 1;
  });
  var numProfile = db.ref(
    `/users/${req.body.puid}/posts/${path[0]}/numOfComments`
  );
  numProfile.transaction((current_value) => {
    return (current_value || 0) + 1;
  });
  var numBreaddit = db.ref(
    `/subreddit/${breaddit}/posts/${path[0]}/numOfComments`
  );
  numBreaddit.transaction((current_value) => {
    return (current_value || 0) + 1;
  });
  //set num of replies for comments
  if (path[1] !== null) {
    var commentRef = db.ref(`${forNumRef}/numOfReplies`);
    commentRef.transaction((current_value) => {
      return (current_value || 0) + 1;
    });
  }

  let userComment = db.ref(`/users/${req.body.uid}/comments/${key}`);
  userComment
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
 * Gets a specific Comment.
 */
router.get("/:_id", (req, res) => {
  // Get a database reference to a comment
  var ref = db.ref("/comments/" + req.params._id);
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
 * Deletes a specific Comment.
 */
router.delete("/:_id", (req, res) => {
  // Get a database reference to a comment
  var ref = db.ref("/comments/" + req.params._id);

  let path = req.body.path.split("/");
  let forRef = `/posts/${path[0]}/comments`;
  path.forEach((curr, index) => {
    if (index > 0) {
      forRef += `/${curr}/replies`;
    }
  });

  var postRef = db.ref(`${forRef}/${req.params._id}/body`);
  postRef.set("[DELETED COMMENT]");

  var userRef = db.ref(`/users/${req.body.uid}/comments/${req.params._id}`);
  userRef.remove();

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

/**
 * Updates a specific Comment.
 */
router.put("/:_id", async (req, res) => {
  // Prevent these from ever getting processed.
  delete req.body.karma;

  // Gets the entry
  var ref1 = db.ref("/comments/" + req.params._id);
  var entry = await ref1
    .once("value")
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error(error);
      res.status(500).send();
      return null;
    });

  // Prevent these from ever getting processed.
  delete entry.karma;

  // Updates entry with updated values.
  let existing_keys = Object.keys(entry);
  Object.keys(req.body).forEach((key) => {
    if (existing_keys.includes(key)) {
      entry[key] = req.body[key];
    }
  });

  // Updates the entry
  var ref2 = db.ref("/comments/" + req.params._id);
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
