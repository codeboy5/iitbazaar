const express = require("express");
const router = express.Router();

const User = require("../models/user");

exports.getUserProfile = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      console.log("We Found The User");
      return res.status(422).send(user);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = User;
