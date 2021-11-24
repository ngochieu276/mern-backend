const mongoose = require("mongoose");
const Product = require("../models/product");

const CartSchema = new mongoose.Schema({
	userId: {
		type: String,
		require: true,
	},
	products: [
		{
			product: {
				type: mongoose.Types.ObjectId,
				ref: Product,
			},
			quantity: {
				type: Number,
				require: true,
			},
			_id: false,
		},
	],
});

module.exports = mongoose.model("Cart", CartSchema);
