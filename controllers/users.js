const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Product = require("../models/product");

exports.getUserProfile = (req, res, next) => {
  const { id } = req.params;
  const userQuery = User.findById(id);
  const productsQuery = Product.find({ seller: id });
  Promise.all([userQuery, productsQuery])
    .then(result => {
      const user = result[0];
      const products = result[1];
      console.log(products);
      return res.status(422).send("We Found The User");
    })
    .catch(err => {
      next(err);
    });
};
