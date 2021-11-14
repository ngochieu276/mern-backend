const express = require("express");
const multer = require("multer");
const { imageUpload } = require("../controllers/imageUpload.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/", upload.single("image"), imageUpload);

module.exports = router;