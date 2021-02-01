/**
 * Template of a Comment in Firebase.
 */
function Comment() {
  return {
    body: "", // String
    karma: 0, // Integer
    authorid: "", // String
    author: "",
    path: "",
    numOfReplies: 0,
  };
}

// Prevents the Class from being modified.
Object.freeze(Comment);
module.exports = Comment;
