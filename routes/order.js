const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");

const router = express.Router();

const {
  addOrder,
  getOrders,
  getOrder,
  cancelOrder,
} = require("../controllers/order");

router.post("/user/addOrder", requireSignin, userMiddleware, addOrder);
router.put("/user/cancelOrder", requireSignin, userMiddleware, cancelOrder);
router.get("/user/getOrders", requireSignin, userMiddleware, getOrders);
router.get("/user/:orderId", requireSignin, userMiddleware, getOrder);

module.exports = router;
