const express = require('express');
const fb = require('../firebase');
const db = fb.database()

let router = express.Router();

/**
 * Fetches a record based off the uid and id of the record.
 * @param {*} uid 
 * @param {*} id 
 */
async function getRecord(uid, id) {
  let ref = db.ref(`/users/${uid}/record/${id}`);
  try {
    const snapshot = await ref.once('value');
    const val = snapshot.val();
    return val;
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Handles record from user profile.
 * @param {*} uid 
 * @param {*} id 
 * @param {*} vote boolean
 * @returns boolean whether successful or not.
 */
async function modifyRecord(uid, id, vote) {
  let record = await getRecord(uid, id);

  if (record !== null) {
    // Record found. Modify it now.

    if (record > 0) {
      if (!vote) {
        // Removing record.
        let isSuccess = await db.ref(`/users/${uid}/record/${id}`).remove().then(() => {
          return true;
        }).catch((error) => {
          console.error(error);
          return false;
        });
        return isSuccess;
      } else {
        // Shouldn't be able to add more than 1 vote.
        return false;
      }
    } else if (record < 0) {
      if (vote) {
        // Removing record.
        let isSuccess = await db.ref(`/users/${uid}/record/${id}`).remove().then(() => {
          return true;
        }).catch((error) => {
          console.error(error);
          return false;
        });
        return isSuccess;
      } else {
        // Shouldn't be able to add more than 1 vote.
        return false;
      }
    } else {
      // Record shouldn't have value of 0. Likely corrupted so consider it non-existant.

      let ref = db.ref(`/users/${uid}/record/${id}`);
      return ref.set(vote ? 1 : -1).then((_) => {
        return true;
      }).catch(error => {
        console.error(error);
        return null;
      });
    }
  } else {
    // No record found. Add it now.

    let ref = db.ref(`/users/${uid}/record/${id}`);
    return ref.set(vote ? 1 : -1).then((_) => {
      return true;
    }).catch(error => {
      console.error(error);
      return null;
    });
  }
}

/**
 * Votes a Comment. User can only upvote or downvote once.
 */
router.post('/comment/:_id', async (req, res) => {
  let uid = req.body.uid;
  let userid = req.body.userid;
  let id = req.params._id;
  let vote = (req.body.vote === true) ? true : false;
  
  let path = req.body.path.split("/");
  let forRef = `/posts/${path[0]}/comments`;
  path.forEach((curr, index) => {
    if(index > 0){
      forRef += `/${curr}/replies`;
    }
  });
  
  // Checks whether the content exists.
  let contentExists = await db.ref(`/comments/${id}/`).once('value').then((snapshot) => {
    return (snapshot.val() !== null) ? true : false;
  });

  if (contentExists) {
    let allowed = await modifyRecord(uid, id, vote);

    if (allowed) {
      db.ref(`${forRef}/${id}/karma`).transaction((val) => {
        return val + (vote ? 1 : -1);
      });
      db.ref(`/users/${userid}/comments/${id}/karma`).transaction((val) => {
        return val + (vote ? 1 : -1);
      });
      db.ref(`/users/${userid}/karma`).transaction((val) => {
        return val + 1;
      });
      db.ref(`/comments/${id}/karma`).transaction((val) => {
        //console.log(val + (vote ? 1 : -1));
        return val + (vote ? 1 : -1);
      }).then(_ => {
        res.status(200).send();
        return
      }).catch(error => {
        console.error(error);
        res.status(500).send();
      });
    } else {
      res.status(403).send();
    }
  } else {
    res.status(404).send();
  }
});

/**
 * Votes a Post. User can only upvote or downvote once.
 */
router.post('/post/:_id', async (req, res) => {
  let uid = req.body.uid;
  let userid = req.body.userid;
  let id = req.params._id;
  let breaddit = req.body.breaddit;
  let vote = (req.body.vote === true) ? true : false;

  // Checks whether the content exists.
  let contentExists = await db.ref(`/posts/${id}/`).once('value').then((snapshot) => {
    return (snapshot.val() !== null) ? true : false;
  });

  if (contentExists) {
    let allowed = await modifyRecord(uid, id, vote);

    if (allowed) {
      db.ref(`/users/${userid}/posts/${id}/karma`).transaction((val) =>{
        return val + (vote ? 1 : -1);
      });
      db.ref(`/users/${userid}/karma`).transaction((val) => {
        return val + 1;
      });
      db.ref(`/subreddit/${breaddit}/posts/${id}/karma`).transaction((val) =>{
        return val + (vote ? 1 : -1);
      });
      db.ref(`/posts/${id}/karma`).transaction((val) => {
        //console.log(val + (vote ? 1 : -1));
        return val + (vote ? 1 : -1);
      }).then(_ => {
        res.status(200).send();
        return
      }).catch(error => {
        console.error(error);
        res.status(500).send();
      });
    } else {
      res.status(403).send();
    }
  } else {
    res.status(404).send();
  }
});

module.exports = router;
