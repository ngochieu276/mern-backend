const express = require("express");
const InvoiceController = require("../controllers/invoice.controller");
const { requireSignin } = require("../common-middleware/index");

const router = express.Router();

router.get("/", requireSignin, async (req, res) => {
	try {
		const userId = req.user._id;
		const status = req.query.status;

		const invoices = await InvoiceController.getAll({userId, status});

		res.send({
			success: 1,
			data: invoices,
		});
	} catch (err) {
		res.send({
			success: 0,
			message: err.message,
		});
	}
});

router.get("/:invoiceId", requireSignin, async (req, res) => {
	try {
		const { invoiceId } = req.params;
		const invoice = await InvoiceController.getOne(invoiceId);

		res.send({
			success: 1,
			data: invoice,
		});
	} catch (err) {
		res.send({
			success: 0,
			message: err.message,
		});
	}
});

router.post("/", requireSignin, async (req, res) => {
	try {
		const userId = req.user._id;
		const { cartId, listedTotal, discountTotal } = req.body;
		const newInvoice = await InvoiceController.addInvoice({
			userId,
			cartId,
			listedTotal,
			discountTotal,
		});

		res.send({
			success: 1,
			data: newInvoice,
		});
	} catch (err) {
		res.send({
			success: 0,
			message: err.message,
		});
	}
});

module.exports = router;
