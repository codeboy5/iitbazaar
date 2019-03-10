const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { isLoggedIn } = require("../middlewares/isAuth");

const {
  getUserProfile,
  getUserCart,
  getCheckout
} = require("../controllers/users");

router.get("/cart", isLoggedIn, getUserCart);

router.get("/invoice/:id", (req, res, next) => {
  var tempFile = path.join(
    __dirname,
    "../",
    "public",
    "invoices",
    `${req.params.id}`
  );
  console.log(tempFile);
  res.sendFile(tempFile);
  // fs.readFile(tempFile, function(err, data) {
  //   res.contentType("application/pdf");
  //   res.send(data);
  // });
  // res.redirect("/");
});

router.get("/checkout", isLoggedIn, getCheckout);

router.get("/:id", isLoggedIn, getUserProfile);

module.exports = router;
