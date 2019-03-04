const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = require("./comment");

const ProductSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  buyers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  name: {
    type: String
  },
  category: {
    type: String
    // validate: {
    //   validator: category => {
    //     //TODO CHECK IF VALUE IS IN A ARRAY
    //     const categories = ["clothes,books,toys"];
    //     const index = categories.findIndex(category);
    //     if (index === -1) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: "This Category Doesn't Exist "
    // }
  },
  price: {
    type: Number
  },
  picture: {
    type: String
  },
  comments: [CommentSchema],
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

//* VIRTUAL PROPERTY :- NOT PERSISTED TO THE DATABASE
ProductSchema.virtual("numberOfLikes").get(function() {
  return this.likedBy.length;
});

//TODO:- ADD METHODS TO INCREASE THE NUMBER OF LIKES

//TODO:- ADD THE RATING PROPERTY AND DISPLAY THE AVERAGE OF THE ALL THE RATINGS USING VIRTUAL PROPERTY

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
