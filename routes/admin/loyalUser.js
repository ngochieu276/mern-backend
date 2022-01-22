const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  getSalesByUsers,
  getUsersByCondition,
} = require("../../controllers/admin/loyalUser");
const router = express.Router();

router.get("/salesByUser", requireSignin, adminMiddleware, getSalesByUsers);
router.post("/getUsersByCondition", getUsersByCondition);

module.exports = router;
