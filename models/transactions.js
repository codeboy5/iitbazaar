const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = require("./cart");

const TransactionSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: String,
    required: true
  },
  cart: [CartSchema]
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
