const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  getBestSalesProduct,
  getSaleByDay,
  getPopulateTags,
  getSalesByMonth,
} = require("../../controllers/admin/summary");
const router = express.Router();

router.get("/getBestSalesProduct", getBestSalesProduct);
router.get("/getSalesByMonth", getSalesByMonth);
router.post("/getPopulateTags", getPopulateTags);
router.post("/getSalesByDay", getSaleByDay);

module.exports = router;
