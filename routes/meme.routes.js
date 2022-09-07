const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Meme = require("../models/Meme.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const bcrypt = require("bcrypt");
const uploadMiddleware = require("../middleware/cloudinary");
const {
  Types: { ObjectId },
} = require("mongoose");
const { Router } = require("express");
//const multer = require("multer");

router.get("/:userId/upload-meme", (req, res) => {
  res.render("user/upload-meme");
});

router.post(
  "/:userId/upload-meme",
  isLoggedIn,
  uploadMiddleware.single("meme-image"),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    await Meme.findByIdAndUpdate(req.session.userId, {
      profilePic: req.file.path,
    });

    res.render("user/upload-meme");
  }
);
module.exports = router;
