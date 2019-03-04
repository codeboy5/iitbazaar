const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");

const isLoggedIn = require("../middlewares/isLoggedIn");

const productController = require("../controllers/products");

router.post(
  "/addProduct",
  isLoggedIn,
  [
    check("name")
      .exists()
      .withMessage("Name is Required"),
    check("price")
      .exists()
      .withMessage("Price Cannot Be Left Empty"),
    check("category")
      .exists()
      .withMessage("Category Cannot Be Empty")
      .isIn(["books", "fashion", "toys"])
      .withMessage("No Such Category")
  ],
  productController.postAddProduct
);

router.get("/", productController.getAllProducts);

module.exports = router;
