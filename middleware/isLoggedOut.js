function isLoggedOut(req, res, next) {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.userId) {
    return res.redirect(`/user${req.session.userId}`);
  }
  next();
}

module.exports = isLoggedOut;
