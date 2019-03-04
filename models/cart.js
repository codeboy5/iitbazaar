const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//! NOT A MODEL JUST A SCHEMA
//! NESTED WITHIN THE USER MODEL

const CartSchema = new Schema({
  quantity: Number,
  price: Number,
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  name: String
});

//TODO:- ADD A VIRTUAL PROPERTY TO CALCULATE THE TOTAL VALUE OF CART

module.exports = CartSchema;
