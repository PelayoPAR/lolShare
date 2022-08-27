const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const bcrypt = require("bcrypt");
const {
  Types: { ObjectId },
} = require("mongoose");

router.get("/:userId", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const userInfo = await User.findById(userId);
    return res.render("user/user");
  } catch (err) {
    console.error(err);
    return res.status(500).render("/", { errorMessage: err.message });
  }
});

router.get("/:userId/update-user", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  console.log("USER ID:", req.params.userId);
  try {
    const userInfo = await User.findById(userId);

    return res.render("user/update-user");
  } catch (err) {
    console.error(err);
    return res.status(500).render("/", { errorMessage: err.message });
  }
});

router.post("/:userId/update-user", isLoggedIn, async (req, res) => {
  const { username = "", email = "" } = req.body;

  if (username.length < 4) {
    return res.status(400).render("user/update-user", {
      usernameError: "Please choose something with more than 4 characters",
      ...req.body,
    });
  }

  if (!email.includes("@")) {
    return res.status(400).render("user/update-user", {
      emailError:
        "Please add, at the very least an @ symbol. We dont ask for THAT much",
      ...req.body,
    });
  }

  const aSingleUser = await User.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: ObjectId(req.session.userId) },
  });

  if (!aSingleUser) {
    await User.findByIdAndUpdate(req.session.userId, { username, email });
    return res.redirect("/");
  }

  User.find({
    _id: {
      $nin: [ObjectId(req.session.userId)],
      $or: [{ username }, { email }],
    },
  });

  res.status(400).render("user/update-user", {
    errorMessage:
      "One of those is taken, please rewrite either the username or email",
  });
});

router.get("/:userId/delete-user", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  console.log("USER ID:", req.params.userId);
  try {
    const userInfo = await User.findById(userId);

    return res.render("user/update-user");
  } catch (err) {
    console.error(err);
    return res.status(500).render("/", { errorMessage: err.message });
  }
});

// router.delete("/:userId/delete-user", isLoggedIn, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.session.userId);
//   } catch (error) {
//     return res.status(500).render("/", { errorMessage: err.message });
//   }
// });

module.exports = router;
