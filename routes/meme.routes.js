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
    console.log("URL", req.file.path);
    console.log("Title", req.body.memeTitle);
    const memeCreated = await Meme.create({
      title: req.body.memeTitle,
      image: req.file.path,
    });
    const currentUserInfo = await User.findById(req.session.user);
    await User.findByIdAndUpdate(req.session.user, {
      memesUploaded: [...currentUserInfo.memesUploaded, memeCreated._id],
    });
    console.log(memeCreated);
    res.render("user/upload-meme", { memeCreated });
  }
);
module.exports = router;
