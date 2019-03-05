// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

//! NEED TO DELETE THE CONSOLE.LOG STATEMENTS
module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, username, password, done) => {
        User.findOne({ username: username }).then(user => {
          if (!user) {
            console.log("No Such User Found");
            return done(
              null,
              false,
              req.flash("loginMessage", "No Such User Found")
            );
          }
          if (!user.checkPassword(password)) {
            console.log("Password is Incorrect");
            return done(
              null,
              false,
              req.flash("loginMessage", "Password is Incorrect")
            );
          }
          if (user.blocked) {
            console.log("Account Was Blocked,Contact Admin");
            return done(
              null,
              false,
              req.flash("loginMessage", "Account Was Blocked,Contact Admin")
            );
          }
          return done(null, user);
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
};
