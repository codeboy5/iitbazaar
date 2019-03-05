exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User Needs To Be Logged In");
  res.redirect("/");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  console.log("User Was Not An Admin");
  res.redirect("/");
};
