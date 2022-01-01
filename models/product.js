const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const diffHistory = require("mongoose-time-machine").plugin;

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
    photos: [],
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    tags: [],
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

productSchema.plugin(mongoosePaginate);
productSchema.plugin(diffHistory, { name: "ProductHistory" });

module.exports = mongoose.model("Product", productSchema);
