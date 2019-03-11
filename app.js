const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
// const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const sgMail = require("@sendgrid/mail");
// const csrf = require("csurf");
const dotenv = require("dotenv");
//! TO BE ADDED

const keys = require("./config/keys");
dotenv.config();

const app = express();

require("./config/passport")(passport);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "products",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

// app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(multer({ storage: storage }).single("image"));

// const parser = multer({ storage: storage });

app.use(expressValidator());

app.set("views", "views");
app.set("view engine", "ejs");

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(csrf());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  // res.locals.csrfToken = req.csrfToken();
  if (req.user) {
    res.locals.isAdmin = req.user.admin;
    res.locals.profile = req.user;
  } else {
    res.locals.isAdmin = undefined;
    res.locals.profile = undefined;
  }
  next();
});

app.get("/", (req, res, next) => {
  // console.log(req.isAuthenticated());
  return res.render("index");
});
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/admin", require("./routes/admin"));
app.use("/users", require("./routes/users"));

app.use((error, req, res, next) => {
  return res.status(404).send(error);
});

//* Connecting To Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MLAB_CONFIG, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB Database");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Listening On Port ${port}`);
    });
  });
