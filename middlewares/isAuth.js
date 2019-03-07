exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User Needs To Be Logged In");
  res.redirect("/auth/login");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  console.log("User Was Not An Admin");
  res.redirect("/");
};

exports.isCurrentUser = (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next();
  }
  console.log("Cannot Edit This User");
  res.redirect("/");
};
