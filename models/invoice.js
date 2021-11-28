const mongoose = require("mongoose");
const Cart = require("../models/cart");

const InvoiceSchema = new mongoose.Schema({
	userId: {
		type: String,
		require: true,
	},
	cart: {
		type: mongoose.Types.ObjectId,
		ref: Cart,
	},
	listedTotal: Number,
	discountTotal: Number,
	status: {
		type: String,
		enum: ["pending", "in_progress", "completed"],
		default: "pending",
	},
	logs: [
		{
			status: {
				type: String,
				enum: ["checked_out", "in_progress", "delivered"],
			},
			date: Date,
			_id: false,
		},
	],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
