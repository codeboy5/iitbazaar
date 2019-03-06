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

const keys = require("./config/keys");

const app = express();

require("./config/passport")(passport);

cloudinary.config({
  cloud_name: keys.cloudinaryConfig.cloud_name,
  api_key: keys.cloudinaryConfig.api_key,
  api_secret: keys.cloudinaryConfig.api_secret
});

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
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  console.log(req.isAuthenticated());
  // console.log(req.user);
  return res.render("index");
});
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/admin", require("./routes/admin"));
app.use("/users", require("./routes/users"));

app.use((error, req, res, next) => {
  console.log(error);
  res.send("Found An Error");
});

//* Connecting To Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/iitbazaar", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB Database");
    const port = 3000;
    app.listen(port, () => {
      console.log(`Listening On Port ${port}`);
    });
  });
