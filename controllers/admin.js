const Product = require("../models/product");
const User = require("../models/user");
const Transaction = require("../models/transactions");

//!TOGGLES BETWEEN FLAGGING PRODUCT AND NOT FLAGGING IT
exports.getFlagProduct = (req, res, next) => {
  const { id } = req.params;
  //   Product.updateOne({ _id: id }, { flagged: true })
  Product.findById(id)
    .then(product => {
      product.flagged = !product.flagged;
      return product.save();
    })
    .then(() => {
      console.log("Product Would No Longer Be Visible");
      return res.redirect("/admin");
    })
    .catch(err => {
      next(err);
    });
};

//!TOGGLES BETWEEN BLOCKING USER AND UNBLOCKING HIM/HER
exports.getBlockUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      user.blocked = !user.blocked;
      return user.save();
    })
    .then(() => {
      console.log("user is blocked,would no longer be able to Login");
      return res.redirect("/admin");
    })
    .catch(err => {
      next(err);
    });
};

exports.getAdminPanel = (req, res, next) => {
  const usersQuery = User.find();
  const productsQuery = Product.find();
  const transactionsQuery = Transaction.find().populate("buyer");
  return Promise.all([usersQuery, productsQuery, transactionsQuery])
    .then(result => {
      const users = result[0];
      const products = result[1];
      const transactions = result[2];
      return res.render("admin/admin", {
        users: users,
        products: products,
        transactions: transactions
      });
    })
    .catch(err => {
      next(err);
    });
};
