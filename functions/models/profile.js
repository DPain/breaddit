/**
 * Template of a default profile in Firebase.
 */
function Profile() {
  return {
    "karma" : 0,
    "name" : "Guest",
    "roles" : {
      "admin" : false
    }
  };
}

// Prevents the Class from being modified.
Object.freeze(Profile);
module.exports = Profile;
