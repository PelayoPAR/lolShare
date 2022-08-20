const express = require("express");
const router = express.Router();
const emailValidator = require("deep-email-validator");

async function isEmailValid(email) {
  return emailValidator.validate(email);

  next();
}

module.exports = isEmailValid;
