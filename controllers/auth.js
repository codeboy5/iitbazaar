const passport = require("passport");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

exports.postSignup = (req, res, next) => {
  const { name, email, password1, password2, username } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO return the user to signup page
    console.log(errors.array());
    return res.status(422).send("Hello We Found An Error");
  }
  User.findOne({
    $or: [{ username: username }, { email: email }]
  }).then(users => {
    if (users) {
      //! Email is Already In Use
      // console.log("Email Is Already In Use");
      return res.status(420).send("Username or Email Is Already In Use");
    }
    if (password1 !== password2) {
      //! passwords do not match
      return res.status(420).send("Passwords Do Not Match");
    }
    const newUser = new User({
      name: name,
      email: email,
      username: username
    });
    newUser.password = newUser.generateHash(password1);
    newUser.save().then(user => {
      //* User Was Created
      return res.status(422).send("Hello");
    });
  });
  //TODO SET UP THE REGISTRATION OF EVERYTHING
};

exports.postLogin = passport.authenticate("local", {
  //TODO:- FILL THE REQUIRED PATHS
  successRedirect: "/",
  failureRedirect: "/",
  failureFlash: true
});

// exports.postLogin = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//     failureFlash: true
//   })(req, res, next);
// };

// exports.postLogin = (req, res, next) => {
//   return res.status(422).send("Login Post Route");
// };

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};
