const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User Needs To Be Logged In");
  res.redirect("/");
};

module.exports = isLoggedIn;
