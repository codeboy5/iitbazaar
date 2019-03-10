// const pdfInvoice = require("pdf-invoice");
// const fs = require("fs");

const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

exports.getAllProducts = (req, res, next) => {
  Product.find({ flagged: false })
    .sort({ name: 1 })
    .skip(0)
    .limit(20)
    .populate("seller")
    .then(products => {
      return res.render("products/products", { products: products });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("products/addProduct");
};

exports.getProduct = (req, res, next) => {
  //! RETRIEVE ID FROM THE REQ BODY OR PARAMS
  const { id } = req.params;
  Product.findById(id)
    .populate("seller")
    .populate("comments.author")
    .then(product => {
      return res.render("products/product", { product: product });
    })
    .catch(err => {
      next(err);
    });
};

exports.postAddComment = (req, res, next) => {
  const { content } = req.body;
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      product.comments.push({
        author: req.user,
        content: content
      });
      return product.save();
    })
    .then(product => {
      return res.redirect(`/products/${product.id}`);
    });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send("Error While Adding a Product");
  }
  const { name, category, price, description } = req.body;
  const newProduct = new Product({
    name: name,
    price: price,
    category: category,
    seller: req.user,
    description: description
  });
  if (req.file) {
    const { url, public_id } = req.file;
    newProduct.imageURL = url;
    newProduct.imageID = public_id;
  }
  newProduct
    .save()
    .then(product => {
      console.log(product);
      return res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
};

//TODO Add Product To Cart
exports.postAddProductToCart = (req, res, next) => {
  const prodID = req.params.id;
  const userQuery = User.findById(req.user.id);
  const productQuery = Product.findById(prodID);
  Promise.all([userQuery, productQuery])
    .then(results => {
      const user = results[0];
      const product = results[1];
      return user.addProductToCart(product);
    })
    .then(() => {
      res.redirect("/products");
    })
    .catch(err => {
      next(err);
    });
};

exports.postFilterProducts = (req, res, next) => {
  const criteria = {};
  if (req.body.name) {
    criteria.name = req.body.name;
  }
  if (req.body.minPrice && req.body.maxPrice) {
    criteria.price = {
      min: req.body.minPrice,
      max: req.body.maxPrice
    };
  }
  Product.find(buildQuery(criteria))
    .then(products => {
      res.status(422).send(products);
    })
    .catch(err => {
      next(err);
    });
};

exports.getAddLikeToProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .then(product => {
      return product.likeProduct(req.user._id);
    })
    .then(product => {
      console.log("Product Was Liked");
      res.status(422).send(product);
    })
    .catch(err => {
      next(err);
    });
};

//! FILTER THE PRODUCTS BASED ON NAME AND PRICE
const buildQuery = criteria => {
  const query = {};
  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }
  if (criteria.price) {
    query.price = {
      $lte: criteria.price.max,
      $gte: criteria.price.min
    };
  }
};
