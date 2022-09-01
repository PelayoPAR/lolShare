const { Schema, model } = require("mongoose");

const MemeSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  postLink: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  subreddit: {
    type: String,
  },
  // comments: { type: String, }
});
