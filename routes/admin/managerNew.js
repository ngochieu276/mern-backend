const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const {
  sendNew,
  getNews,
  getNewById,
} = require("../../controllers/admin/managerNew");
const router = express.Router();

router.post("/create", requireSignin, adminMiddleware, sendNew);
router.get("/", requireSignin, adminMiddleware, getNews);
router.get("/:newId", requireSignin, adminMiddleware, getNewById);

module.exports = router;
