/**
 * Template of a Comment in Firebase.
 */
function Comment() {
  return {
    body: "", // String
    karma: 0, // Integer
    author: "" // String
  }
}

// Prevents the Class from being modified.
Object.freeze(Comment);

module.exports = Comment;
