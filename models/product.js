const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    listedPrice: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
      require: true,
    },
    is_hot: {
      type: Boolean,
    },
    in_slider: {
      type: Boolean,
    },
    avatar: {
      type: String,
    },
    photos: [{ img: { type: String } }],
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    tags: [{ tag: { type: String } }],
    supplier: {
      type: String,
    },
    profilePicture: { type: String },
    createdAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
