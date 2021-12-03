const Invoice = require("../models/invoice");
const Cart = require("../models/cart");
const Product = require("../models/product.js");

const getAll = async ({ userId, status }) => {
	const filter = status ? { userId, status } : { userId };

	const invoices = await Invoice.find(filter).select("-__v");

	if (!invoices) throw new Error("No invoices");

	return invoices;
};

const getOne = async (invoiceId) => {
	const invoice = await Invoice.findById(invoiceId)
		.select("-__v")
		.populate({
			path: "cart",
			select: "-__v",
			populate: {
				path: "products.product",
				select: "-__v",
			},
		});

	if (!invoice) throw new Error("Invoice not found");

	return invoice;
};

const addInvoice = async ({ userId, cartId, listedTotal, discountTotal }) => {
	const newInvoice = await Invoice.create({
		userId,
		cart: cartId,
		listedTotal,
		discountTotal,
		logs: [{ status: "checked_out", date: new Date() }],
	});

	const cart = await Cart.findById(cartId).lean();

	const { products } = cart;

	products.forEach(async (item) => {
		await Product.findByIdAndUpdate(item.product, {
			$inc: { quantity: -item.quantity },
		});
	});

	return newInvoice;
};

module.exports = { getAll, getOne, addInvoice };
