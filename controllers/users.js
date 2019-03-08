const express = require("express");
const pdfInvoice = require("pdf-invoice");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const User = require("../models/user");
const Product = require("../models/product");
const Transaction = require("../models/transactions");

exports.getUserProfile = (req, res, next) => {
  const { id } = req.params;
  const userQuery = User.findById(id);
  const productsQuery = Product.find({ seller: id });
  Promise.all([userQuery, productsQuery])
    .then(result => {
      const user = result[0];
      const products = result[1];
      return res.render("users/user", { user: user, products: products });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCheckout = (req, res, next) => {
  let today = new Date().toISOString().slice(0, 10);
  const id = req.user.id;
  User.findById(id).then(user => {
    const newDocument = {
      company: {
        phone: "(99) 9 9999-9999",
        email: "biit@evilcorp.com",
        address: "IIT Delhi",
        name: "BIIT"
      },
      customer: {
        name: user.firstName,
        email: user.email
      },
      items: []
    };
    const document = pdfInvoice(newDocument);
    document.generate();
    document.pdfkitDoc.pipe(
      fs.createWriteStream(`../public/invoices/${Date.now().toString()}`)
    );
    //TODO:- Assign the newDocument.items to the user cart
    const newTransaction = {
      buyer: user,
      date: today
    };
    //TODO Assign the new transaction cart to whatever the user cart is
    return Transaction(newTransaction).save();
  });
  //!EMPTY CART OF THE USER
};
