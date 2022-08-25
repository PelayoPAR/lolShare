function isLoggedOut(req, res, next) {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.user) {
    console.log(req.session);
    console.log("is logged out");
    return res.redirect(`/`);
  }
  next();
}

module.exports = isLoggedOut;
