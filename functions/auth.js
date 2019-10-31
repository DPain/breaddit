const fb = require('./firebase');

module.exports = {
  isAuthenticated: function (req, res, next) {
    var user = fb.auth.currentUser;

    console.log("USER");
    console.log(JSON.stringify(user, null, 2));

    if (user !== null) {
      req.user = user;
      
      return next();
    } else {
      res.redirect('/');
    }
  },
}