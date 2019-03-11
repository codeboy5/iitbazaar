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

exports.getUserCart = (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("users/cart", { user: user });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCheckout = (req, res, next) => {
  let today = new Date().toISOString().slice(0, 10);
  const id = req.user.id;
  let pdfLink = "";
  User.findById(id)
    .then(user => {
      const newDocument = {
        company: {
          phone: "(99) 9 9999-9999",
          email: "biit@evilcorp.com",
          address: "IIT Delhi",
          name: "BIIT - IIT BAZAAR"
        },
        customer: {
          name: user.name,
          email: user.email
        },
        items: []
      };
      user.cart.forEach(item => {
        newDocument.items.push({
          amount: item.price,
          name: item.name,
          quantity: item.quantity
        });
      });
      const document = pdfInvoice(newDocument);
      document.generate();
      const timeNow = `${Date.now().toString()}.pdf`;
      console.log(timeNow);
      document.pdfkitDoc.pipe(
        fs.createWriteStream(
          path.join(__dirname, "../", "public", "invoices", `${timeNow}`)
        )
      );
      //TODO:- Assign the newDocument.items to the user cart
      const newTransaction = {
        buyer: user,
        date: today,
        cart: []
      };
      newTransaction.cart = [...user.cart];
      user.cart = [];
      user.pdf = timeNow;
      user.respectPoints += parseInt(user.totalCartPrice) / 10;
      pdfLink = timeNow;
      return Promise.all([user.save(), Transaction(newTransaction).save()]);
    })
    .then(() => {
      return res.render("download", { pdf: pdfLink });
    })
    .catch(err => {
      next(err);
    });
  //!EMPTY CART OF THE USER
};
