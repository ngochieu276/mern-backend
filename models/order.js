// const mongoose = require("mongoose");
// const Cart = require("../models/cart");

// const InvoiceSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     require: true,
//   },
//   cart: {
//     type: mongoose.Types.ObjectId,
//     ref: Cart,
//   },
//   listedTotal: Number,
//   discountTotal: Number,
//   status: {
//     type: String,
//     enum: ["pending", "in_progress", "completed"],
//     default: "pending",
//   },
//   logs: [
//     {
//       status: {
//         type: String,
//         enum: ["checked_out", "in_progress", "delivered"],
//       },
//       date: Date,
//       _id: false,
//     },
//   ],
// });

// module.exports = mongoose.model("Invoice", InvoiceSchema);

// /////////////

const mongoose = require("mongoose");

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
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled", "refund"],
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
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "order",
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

module.exports = mongoose.model("Order", orderSchema);
