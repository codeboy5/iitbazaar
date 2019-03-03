const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = require("./cart");

const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  address: {
    type: String
  },
  phoneNumber: Number,
  cart: CartSchema
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
