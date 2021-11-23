const Cart = require("../models/cart");
// const Product = require("../models/product")

const getCart = async (userId) => {
	// to be changed, also return totalPrice and totalQuantity
	const cart = await Cart.findOne({ userId: userId }).populate({
		path: "products",
		select: "-__v",
	});

	if (!cart) throw new Error("Empty cart");

	return cart;
};

const addToCart = async ({ userId, products }) => {
	const cart = await Cart.findOne({ userId: userId });

	if (!cart) {
		const newCart = await Cart.create({
			userId,
			products,
		});

		return newCart;
	}

	const newCart = cart.products.concat(products);

	return newCart;
};

const removeItem = async ({ userId, productId }) => {
	const cart = await Cart.findOne({ userId: userId });

	if (!cart) throw new Error("Empty cart");

	cart.products = cart.products.filter((product) => product !== productId);

	await cart.save();

	return cart;
};

const updateQuantity = async ({ userId, productId, quantity }) => {
	const cart = await Cart.findOne({ userId: userId });

	if (!cart) throw new Error("Empty cart");

	cart.products = cart.products.map((product) => {
		if (product.productId == productId) {
			product.quantity = quantity;
		}
		return product;
	});

  await cart.save();

	return cart;
};

const clearCart = async (userId) => {
	await Cart.findByIdAndDelete(userId);
};

module.exports = { getCart, addToCart, removeItem, updateQuantity, clearCart };
