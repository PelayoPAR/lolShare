const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/:userId", isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const userInfo = await User.findById(userId);
    console.log(userInfo);
    return res.render("user/user");
  } catch (err) {
    console.error(err);
    return res.status(500).render("/", { errorMessage: err.message });
  }
});

module.exports = router;
