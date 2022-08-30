const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const bcrypt = require("bcrypt");
const RedditImageFetcher = require("reddit-image-fetcher");

/* GET home page */
router.get("/", (req, res, next) => {
  RedditImageFetcher.fetch({
    type: "custom",
    total: 20,
    addSubreddit: ["memes", "funny", "dankmemes"],
    removeSubreddit: [],
  })
    .then((result) => {
      console.log(result);
      res.render("index", { result });
    })
    .catch((err) => {
      res.status(500).res.render("index");
    });

  // To enable anti-André mode:
  // RedditImageFetcher.fetch({
  //   type: "custom",
  //   total: 10,
  //   subreddit: ["cats", "Catswhoyell", "sleepingcats"],
  // })
  //   .then((result) => {
  //     console.log(result);
  //     res.render("index", { result });
  //   })
  //   .catch((err) => {
  //     res.status(500).res.render("index");
  //   });
});

module.exports = router;
