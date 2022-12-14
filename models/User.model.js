const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true, //-> Ideally, should be unique, but its up to you
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favorites: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "premium"],
    },

    memesUploaded: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Meme",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
