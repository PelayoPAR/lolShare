const { Schema, model } = require("mongoose");

const memeSchema = new Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
const Meme = model("Meme", memeSchema);

module.exports = Meme;
