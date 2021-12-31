const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const { sendNew, getNews } = require("../../controllers/admin/managerNew");
const router = express.Router();

router.post("/create", requireSignin, adminMiddleware, sendNew);
router.get("/", requireSignin, adminMiddleware, getNews);

module.exports = router;
