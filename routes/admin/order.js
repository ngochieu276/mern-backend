const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  updateOrders,
  getCustomerOrders,
} = require("../../controllers/admin/order");
const router = express.Router();

router.post("/update", requireSignin, adminMiddleware, updateOrders);

router.get(
  "/getCustomerOrders",
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);

module.exports = router;
