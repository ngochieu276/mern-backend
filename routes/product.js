const express = require("express");
const {
  getHotProducts,
  getInSliderProducts,
  getProductById,
  getProducts,
} = require("../controllers/product");

const router = express.Router();
router.get("/", getProducts);
router.get("/isHot", getHotProducts);
router.get("/inSlider", getInSliderProducts);
router.get("/:productId", getProductById);

module.exports = router;
