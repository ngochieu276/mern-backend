const mongoose = require("mongoose");

const NewSchema = new mongoose.Schema(
  {
    new: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      required: true,
    },
    receiver: [],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("New", NewSchema);
