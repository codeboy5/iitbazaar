const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");

const { isLoggedIn } = require("../middlewares/isAuth");

const productController = require("../controllers/products");

router.get("/addProduct", isLoggedIn, productController.getAddProduct);

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
      .isIn(["books", "fashion", "tech"])
      .withMessage("No Such Category"),
    check("description")
      .exists()
      .isLength({ min: 5 })
      .withMessage("Is Required and Longer Than 5")
  ],
  productController.postAddProduct
);

router.get(
  "/addProductToCart/:id",
  isLoggedIn,
  productController.postAddProductToCart
);

router.post("/filterProducts", productController.postFilterProducts);

router.post("/addComment/:id", isLoggedIn, productController.postAddComment);

router.get("/:id", productController.getProduct);

router.get("/", productController.getAllProducts);

module.exports = router;
