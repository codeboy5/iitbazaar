const express = require("express");
const router = express.Router();
// const {} = require("express-validator/check");
const { getFlagProduct, getBlockUser } = require("../controllers/admin");

const { isAdmin } = require("../middlewares/isAuth");

router.get("/flagProduct/:id", isAdmin, getFlagProduct);

router.get("/blockUser/:id", isAdmin, getBlockUser);

module.exports = router;
