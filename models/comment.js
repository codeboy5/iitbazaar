const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//! JUST A SCHEMA, NOT A MODEL
//! COMMENT IS NESTED INSIDE A PARTICULAR PRODUCT

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String
  },
  body: {
    type: String
  }
});

module.exports = CommentSchema;
