const { Router } = require("express");

const baseRouter = Router();

baseRouter.use((req, res, next) => {
  next();
});

baseRouter.get("/", (req, res) => {
  res.render("index");
});

module.exports = baseRouter;
