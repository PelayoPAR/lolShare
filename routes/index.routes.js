const router = require("express").Router();

const RedditImageFetcher = require("reddit-image-fetcher");

/* GET home page */
router.get("/", (req, res, next) => {
  RedditImageFetcher.fetch({
    type: "custom",
    total: 50,
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
