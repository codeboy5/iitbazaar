const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const CartSchema = require("./cart");

const UserSchema = new Schema({
  name: {
    type: String,
    text: true
  },
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String
  },
  address: {
    type: String
  },
  phoneNumber: Number,
  cart: [CartSchema],
  admin: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  respectPoints: {
    type: String,
    default: 0
  },
  pdf: String
});

//TODO:- CHECK IF THE USER HAS APPLIED THE OPTION TO USE THE RESPECT POINTS AND THEN ACCORDINGLY DEDUCT THE PRICE
UserSchema.virtual("totalCartPrice").get(function() {
  let totalPrice = 0;
  this.cart.forEach(element => {
    totalPrice += element.quantity * element.price;
  });
  return totalPrice;
});

UserSchema.methods.addProductToCart = function(prod, quantity = 1) {
  const index = this.cart.findIndex(
    item => item.product.toString() === prod._id.toString()
  );
  if (index === -1) {
    this.cart.push({
      name: prod.name,
      product: prod,
      price: prod.price,
      quantity: quantity
    });
  } else {
    this.cart[index].quantity += quantity;
  }
  return this.save();
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 10, null);
};

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
