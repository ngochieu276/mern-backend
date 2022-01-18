const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  getBestSalesProduct,
  getSaleByDay,
  getPopulateTags,
  getSalesByMonth,
  getSalesByUsers,
  getRebuyPercent,
} = require("../../controllers/admin/summary");
const router = express.Router();

router.get("/getSalesByUsers", getSalesByUsers);
router.get("/getSalesByMonth", getSalesByMonth);
router.post("/getRebuyPercent", getRebuyPercent);
router.post("/getBestSalesProduct", getBestSalesProduct);
router.post("/getPopulateTags", getPopulateTags);
router.post("/getSalesByDay", getSaleByDay);

module.exports = router;
