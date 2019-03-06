const passport = require("passport");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");

const User = require("../models/user");

const authController = require("../controllers/auth");

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post(
  "/signup",
  [
    check("name")
      .exists()
      .withMessage("Name is A Required Field")
      .isLength({ min: 3 })
      .withMessage("Name Must Be Longer Than 2 Characters"),
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not A Valid Email Address"),
    check("username")
      .exists()
      .withMessage("Username is Required")
    // .trim()
    // .custom(email => {
    //   User.findOne({ email: email }).then(user => {
    //     if (user) {
    //       throw new Error("Email Is Already In Use");
    //     } else {
    //       return true;
    //     }
    //   });
    // })
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    check("username")
      .exists()
      .withMessage("Username Cannot Be Empty"),
    check("password")
      .exists()
      .withMessage("password cannot be blank")
  ],
  authController.postLogin
);

router.get("/logout", authController.getLogout);

module.exports = router;
