const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  post: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: { type: Date },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
