const Product = require("../models/product");
const { validationResult } = require("express-validator/check");

exports.getAllProducts = (req, res, next) => {
  Product.find({})
    .sort({ name: 1 })
    .skip(0)
    .limit(20)
    .populate("seller")
    .then(products => {
      return res.status(422).send(products);
    })
    .catch(err => {
      next(err);
    });
};

exports.filterProducts = (req, res, next) => {
  const criteria = {};
  Product.find(buildQuery(criteria))
    .populate("author")
    .then(products => {
      return res.send(products);
    })
    .catch(err => {
      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  //! RETRIEVE ID FROM THE REQ BODY OR PARAMS
  const { id } = null;
  Product.findById(id)
    .populate("author")
    .then(product => {
      return res.send(product);
    })
    .catch(err => {
      next(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send("Error While Adding a Product");
  }
  const { name, category, price } = req.body;
  const newProduct = new Product({
    name: name,
    price: price,
    category: category,
    seller: req.user
  });
  newProduct
    .save()
    .then(product => {
      console.log(product);
      return res.status(422).send("Product Was Added To The Database");
    })
    .catch(err => {
      next(err);
    });
};

//TODO Add Product To Cart

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
