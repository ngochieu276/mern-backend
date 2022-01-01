const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
	"sk_test_51K2XQmG4O6UAM7MpNY598uXaCB7JQCVSA2UaH1ch8DL49wYi4Y877d69zC9qNARzEkZCO7UIZaj6QcZALpwETIr800Uyq4HusN"
);
const { requireSignin } = require("../common-middleware/index");
const CartController = require("../controllers/cart.controller");
const { cancelOrder } = require("../controllers/order");

router.post("/create-payment-intent", requireSignin, async (req, res) => {
	const userId = req.user._id;

	try {
		const cart = await CartController.getCart(userId);

		const paymentIntent = await stripe.paymentIntents.create({
			amount: cart.discountTotal * 100,
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
		});

		res.send({
			success: 1,
			clientSecret: paymentIntent.client_secret,
		});
	} catch (err) {
		res.send({
			success: 0,
			message: err.message,
		});
	}
});

router.post("/refund", requireSignin, async (req, res) => {
	const { paymentIntentId } = req.body;

	try {
		const refund = await stripe.refunds.create({
			payment_intent: paymentIntentId,
		});

		// cancelOrder(req, res);

		res.send({
			success: 1,
			data: { refund },
		});
	} catch (err) {
		res.send({
			success: 0,
			message: err.message,
		});
	}
});

module.exports = router;
