const Product = require("../models/product");
const User = require("../models/user");

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
      return res.redirect("/");
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
      console.log("user is blocked,would no longer be able to ");
      return res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
};
