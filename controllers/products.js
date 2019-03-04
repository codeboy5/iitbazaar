const Product = require("../models/product");
const User = require("../models/user");
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
  const { id } = req.params;
  Product.findById(id)
    .populate("seller")
    .populate("comments.author")
    .then(product => {
      console.log("Found the Product");
      return res.status(422).send(product);
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
      console.log(product, "Comment Was Added");
      return res.status(422).send(product);
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
exports.postAddProductToCart = (req, res, next) => {
  const { id, quantity } = req.body;

  const userQuery = User.findById(req.user._id);
  const productQuery = Product.findById(id);

  Promise.all([userQuery, productQuery])
    .then(results => {
      const newCartItem = {
        name: results[1].name,
        price: results[1].price,
        quantity: quantity,
        product: results[1]
      };
      results[0].cart.push(newCartItem);
      return results[0].save();
    })
    .then(user => {
      console.log(user.totalCartPrice);
      return res.status(422).send("Product Was Added To The Cart");
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
