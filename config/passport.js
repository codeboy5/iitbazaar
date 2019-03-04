// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        User.findOne({ email: email }).then(user => {
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "No Such User Found")
            );
          }
          if (!user.checkPassword(password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Password is Incorrect")
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
