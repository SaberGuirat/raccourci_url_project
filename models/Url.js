const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    longUrl: {
      type: String,
      required: true,
      trim : true
    },
    shortUrl: {
      type: String,
    },
    urlCode: {
      type: String,
    },
    visited: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", urlSchema);
