/**
 * Template of a Post in Firebase.
 */
function Post() {
  return {
    authorid: "", // String
    author: "",
    body: "", // String
    karma: 0, // Integer
    numOfComments: 0,
    subreddit: "",  // String
    title: "" // String
  };
}

// Prevents the Class from being modified.
Object.freeze(Post);
module.exports = Post;
