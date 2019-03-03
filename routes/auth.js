const passport = require("passport");
const express = require("express");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  const { name, email, password1, password2 } = req.body;
  //TODO SET UP THE REGISTRATION OF EVERYTHING
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    //TODO:- FILL THE REQUIRED PATHS
    successRedirect: "",
    failureRedirect: "",
    failureFlash: true
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
