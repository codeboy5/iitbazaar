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
  cart: [CartSchema]
});

UserSchema.virtual("totalCartPrice").get(function() {
  let totalPrice = 0;
  this.cart.forEach(element => {
    totalPrice += element.quantity * element.price;
  });
  return totalPrice;
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 10, null);
};

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
