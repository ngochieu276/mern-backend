const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  updateOrders,
  getCustomerOrders,
  getCustomOrderById,
  getCustomerOrdersByEmail,
  sortOrder,
  getUnCaredOrder,
  getCaredOrder,
  addOrderToAdmin,
  manageOrderSearch,
} = require("../../controllers/admin/order");
const router = express.Router();

router.put("/update", requireSignin, adminMiddleware, updateOrders);

router.post(
  "/getOrdersByEmail",
  requireSignin,
  adminMiddleware,
  getCustomerOrdersByEmail
);
router.post(
  "/addOrdersToAdmin",
  requireSignin,
  adminMiddleware,
  addOrderToAdmin
);
router.post(
  "/manageOrderSearch",
  requireSignin,
  adminMiddleware,
  manageOrderSearch
);

router.get(
  "/getCustomerOrders",
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);
router.get("/getCaredOrders", requireSignin, adminMiddleware, getCaredOrder);

router.get(
  "/getUncaredOrders",
  requireSignin,
  adminMiddleware,
  getUnCaredOrder
);

router.get("/sort/:orderBy", requireSignin, adminMiddleware, sortOrder);

router.get("/:orderId", requireSignin, adminMiddleware, getCustomOrderById);

module.exports = router;
