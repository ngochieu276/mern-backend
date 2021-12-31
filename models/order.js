const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const diffHistory = require("mongoose-diff-history/diffHistory");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchaseQty: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      default: "ordered",
      enum: ["ordered", "in_progress", "completed", "cancelled"],
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["cod", "card"],
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "in_progress", "completed"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(diffHistory.plugin);

module.exports = mongoose.model("Order", orderSchema);
