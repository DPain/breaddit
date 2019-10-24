/**
 * Template of a Post in Firebase.
 */
function Post() {
  return {
    author: "", // String
    body: "", // String
    comments: [], // Array of String
    karma: 0, // Integer
    subreddit: "",  // String
    title: "" // String
  }
}

// Prevents the Class from being modified.
Object.freeze(Post);

module.exports = Post;