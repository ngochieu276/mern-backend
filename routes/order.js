const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");

const router = express.Router();

const { addOrder, getOrders, getOrder } = require("../controllers/order");

router.post("/user/addOrder", requireSignin, userMiddleware, addOrder);

router.get("/user/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/user/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;
