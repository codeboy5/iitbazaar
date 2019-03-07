// const pdfInvoice = require("pdf-invoice");
// const fs = require("fs");

const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

exports.getAllProducts = (req, res, next) => {
  // const document = pdfInvoice({
  //   company: {
  //     phone: "(99) 9 9999-9999",
  //     email: "company@evilcorp.com",
  //     address: "Av. Companhia, 182, Água Branca, Piauí",
  //     name: "Evil Corp."
  //   },
  //   customer: {
  //     name: "Elliot Raque",
  //     email: "raque@gmail.com"
  //   },
  //   items: [
  //     {
  //       amount: 50.0,
  //       name: "XYZ",
  //       description: "Lorem ipsum dollor sit amet",
  //       quantity: 12
  //     },
  //     {
  //       amount: 12.0,
  //       name: "ABC",
  //       description: "Lorem ipsum dollor sit amet",
  //       quantity: 12
  //     },
  //     {
  //       amount: 127.72,
  //       name: "DFE",
  //       description: "Lorem ipsum dollor sit amet",
  //       quantity: 12
  //     }
  //   ]
  // });
  // document.generate();
  // document.pdfkitDoc.pipe(fs.createWriteStream("file.pdf"));
  Product.find({ flagged: false })
    .sort({ name: 1 })
    .skip(0)
    .limit(20)
    .populate("seller")
    .then(products => {
      // return res.status(422).send(products);
      res.render("products/products", { products: products });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("products/addProduct");
};

exports.getProduct = (req, res, next) => {
  //! RETRIEVE ID FROM THE REQ BODY OR PARAMS
  const { id } = req.params;
  Product.findById(id)
    .populate("seller")
    .populate("comments.author")
    .then(product => {
      console.log("Found the Product");
      return res.status(422).send(product);
    })
    .catch(err => {
      next(err);
    });
};

exports.postAddComment = (req, res, next) => {
  const { content } = req.body;
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      product.comments.push({
        author: req.user,
        content: content
      });
      return product.save();
    })
    .then(product => {
      console.log(product, "Comment Was Added");
      return res.status(422).send(product);
    });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send("Error While Adding a Product");
  }
  const { name, category, price } = req.body;
  const newProduct = new Product({
    name: name,
    price: price,
    category: category,
    seller: req.user
  });
  if (req.file) {
    const { url, public_id } = req.file;
    newProduct.imageURL = url;
    newProduct.imageID = public_id;
  }
  newProduct
    .save()
    .then(product => {
      console.log(product);
      return res.status(422).send("Product Was Added To The Database");
    })
    .catch(err => {
      next(err);
    });
};

//TODO Add Product To Cart
exports.postAddProductToCart = (req, res, next) => {
  const { id, quantity } = req.body;

  const userQuery = User.findById(req.user._id);
  const productQuery = Product.findById(id);

  Promise.all([userQuery, productQuery])
    .then(results => {
      const newCartItem = {
        name: results[1].name,
        price: results[1].price,
        quantity: quantity,
        product: results[1]
      };
      results[0].cart.push(newCartItem);
      return results[0].save();
    })
    .then(user => {
      console.log(user.totalCartPrice);
      return res.status(422).send("Product Was Added To The Cart");
    })
    .catch(err => {
      next(err);
    });
};

exports.postFilterProducts = (req, res, next) => {
  const criteria = {};
  if (req.body.name) {
    criteria.name = req.body.name;
  }
  if (req.body.minPrice && req.body.maxPrice) {
    criteria.price = {
      min: req.body.minPrice,
      max: req.body.maxPrice
    };
  }
  Product.find(buildQuery(criteria))
    .then(products => {
      res.status(422).send(products);
    })
    .catch(err => {
      next(err);
    });
};

exports.getAddLikeToProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .then(product => {
      return product.likeProduct(req.user._id);
    })
    .then(product => {
      console.log("Product Was Liked");
      res.status(422).send(product);
    })
    .catch(err => {
      next(err);
    });
};

//! FILTER THE PRODUCTS BASED ON NAME AND PRICE
const buildQuery = criteria => {
  const query = {};
  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }
  if (criteria.price) {
    query.price = {
      $lte: criteria.price.max,
      $gte: criteria.price.min
    };
  }
};
