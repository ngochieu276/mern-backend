const express = require("express");

const stripe = require("stripe")(
	"sk_test_51K2XQmG4O6UAM7MpNY598uXaCB7JQCVSA2UaH1ch8DL49wYi4Y877d69zC9qNARzEkZCO7UIZaj6QcZALpwETIr800Uyq4HusN"
);

const router = express.Router();

const Invoice = require("../models/invoice");
const User = require("../models/user");
const CartController = require("../controllers/cart.controller");

router.post("/checkout", async (req, res) => {
	const { invoiceId } = req.body;
	try {
		const invoice = await Invoice.findById(invoiceId);

		if (!invoice) throw new Error("Invoice not found");

		const user = await User.findById(invoice.userId);

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					invoiceId: invoiceId,
					amount: invoice.discountTotal,
				},
			],
			mode: "payment",
			// to be changed
			success_url: "https://example.com/success",
			cancel_url: "https://example.com/cancel",
		});

		// Delete cart
		await CartController.clearCart(invoice.userId);

		// Update invoice status and logs
		const newLog = { status: "delivered", date: new Date() };
		invoice.logs.push(newLog);
		invoice.status = "completed";
		await invoice.save();

		res.redirect(303, session.url);
	} catch (err) {
		res.send({
			success: 0,
			message: err,
		});
	}
});

module.exports = router;
