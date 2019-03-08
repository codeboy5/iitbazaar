const express = require("express");
const router = express.Router();
// const {} = require("express-validator/check");
const {
  getFlagProduct,
  getBlockUser,
  getAdminPanel
} = require("../controllers/admin");

const { isAdmin } = require("../middlewares/isAuth");

router.get("/", isAdmin, getAdminPanel);

router.get("/flagProduct/:id", isAdmin, getFlagProduct);

router.get("/blockUser/:id", isAdmin, getBlockUser);

module.exports = router;
