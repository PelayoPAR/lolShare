const app = require("./app");

const express = require("express");

const RedditImageFetcher = require("reddit-image-fetcher");

require("./db");

require("./config")(app);

const baseRouter = require("./routes/base.routes");
app.use("/", baseRouter);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

// adding commits to test that everything is set up as it should
// monkey sees monkey does

// testing the new version of the structure
