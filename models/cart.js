const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
	userId: {
		type: String,
		require: true,
	},
	// to be changed
	products: [
		{
			productId: {
				type: mongoose.Types.ObjectId,
				ref: products,
			},
			quantity,
		},
	],
});

module.exports = mongoose.model("Cart", CartSchema);
