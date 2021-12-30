const express = require("express");
const { adminMiddleware } = require("../../common-middleware");
const { requireSignin } = require("../../common-middleware");
const {
  getReports,
  advangeSearchReports,
  updateReportsToChecked,
} = require("../../controllers/admin/report");
const router = express.Router();

router.get("/", requireSignin, adminMiddleware, getReports);
router.post(
  "/advangeSearchReports",
  requireSignin,
  adminMiddleware,
  advangeSearchReports
);
router.get(
  "/updateReportsToChecked",
  requireSignin,
  adminMiddleware,
  updateReportsToChecked
);

module.exports = router;
