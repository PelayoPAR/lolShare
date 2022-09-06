const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const bcrypt = require("bcrypt");
const uploadMiddleware = require("../middleware/cloudinary");
const {
  Types: { ObjectId },
} = require("mongoose");
const { Router } = require("express");

// USER PROFILE:
router.get("/:userId", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const userInfo = await User.findById(userId);
    return res.render("user/user");
  } catch (err) {
    console.error(err);
    return res.status(500).redirect("/", { errorMessage: err.message });
  }
});

// UPDATE USER:
router.get("/:userId/update-user", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  //   req.session.user._id
  console.log("USER ID:", req.params.userId);
  try {
    const userInfo = await User.findById(userId);

    return res.render("user/update-user");
  } catch (err) {
    console.error(err);
    return res.status(500).redirect("/", { errorMessage: err.message });
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
  //   console.log("I AM HERE ON TV", req.session.userId);
  const aSingleUser = await User.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: ObjectId(req.session.user._id) },
  });

  if (!aSingleUser) {
    await User.findByIdAndUpdate(req.session.user._id, { username, email });
    return res.redirect("/");
  }

  User.find({
    _id: {
      $nin: [ObjectId(req.session.user._id)],
      $or: [{ username }, { email }],
    },
  });

  res.status(400).render("user/update-user", {
    errorMessage:
      "One of those is taken, please rewrite either the username or email",
  });
});

// UPDATE PASSWORD:
router.get("/:userId/update-password", isLoggedIn, async (req, res) => {
  // console.log("REQUSER:", req.user);
  console.log("REQSESSIONUSER", req.session.user);
  res.render("user/update-password", { user: req.session.user });
});
//
router.post("/:userId/update-password", isLoggedIn, async (req, res) => {
  const user = req.session.user;
  const { password = "", newPassword = "", confirmPassword = "" } = req.body;
  console.log("Passwordsss:", password, newPassword, confirmPassword);

  if (password.length < 8) {
    return res.status(400).render("user/update-password", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  //
  if (newPassword.length < 8) {
    return res.status(400).render("user/update-password", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).render("user/update-password", {
      passwordError: "Your password and your confirmed password must match",
      ...req.body,
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length

  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // if (!regex.test(password)) {
  //   return res.status(400).render("signup", {
  //     errorMessage:
  //       "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //   });
  // }

  const isSamePassword = bcrypt.compareSync(password, user.password);

  if (!isSamePassword) {
    return res.status(400).render("user/update-password", {
      user,
      errorMessage: "That is not your password",
    });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(15));

  await User.findByIdAndUpdate(req.session.user._id, {
    password: hashedPassword,
  });

  res.redirect("/");
});

// DELETE USER:
router.get("/:userId/delete-user", isLoggedIn, async (req, res) => {
  const userId = req.session.user._id;
  console.log("USER ID:", req.session.user._id);
  try {
    const userInfo = await User.findById(userId);

    return res.render("user/delete-user");
  } catch (err) {
    console.error(err);
    return res.status(500).redirect("/", { errorMessage: err.message });
  }
});

router.post("/:userId/delete-user", isLoggedIn, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.user._id);
    console.log("User deleted");
    //after deleting the user from the DB, also destroy the session to avoid mismatch between DB and browser (or else the user still exists "in the browser")
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .render("auth/logout", { errorMessage: err.message });
      }
      return res.redirect("/");
    });
    return res.status(200).redirect("/");
  } catch (error) {
    return res.status(500).redirect("/", { errorMessage: err.message });
  }
});

module.exports = router;
