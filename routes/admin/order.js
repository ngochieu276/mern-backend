const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  updateOrders,
  getCustomerOrders,
  getCustomOrderById,
  getCustomerOrdersByEmail,
  sortOrder,
  getOrderHistory,
} = require("../../controllers/admin/order");
const router = express.Router();

router.post("/update", requireSignin, adminMiddleware, updateOrders);

router.post(
  "/getOrdersByEmail",
  requireSignin,
  adminMiddleware,
  getCustomerOrdersByEmail
);

router.get(
  "/getCustomerOrders",
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);
router.get("/sort/:orderBy", requireSignin, adminMiddleware, sortOrder);

router.get("/:orderId", requireSignin, adminMiddleware, getCustomOrderById);
router.get(
  "/:orderId/histories",
  requireSignin,
  adminMiddleware,
  getOrderHistory
);

module.exports = router;
