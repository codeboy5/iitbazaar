const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

require("./config/passport")(passport);

app.use(morgan("dev"));
app.use(bodyParser({ extended: true }));
app.use(cookieParser());

app.set("views", "views");
app.set("view engine", "ejs");

app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
