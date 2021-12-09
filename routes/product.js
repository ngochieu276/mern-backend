const express = require("express");
const {
  getHotProducts,
  getInSliderProducts,
  getProductById,
  getProductsByQuery,
  getAllProducts,
} = require("../controllers/product");

const router = express.Router();

router.get("/isHot", getHotProducts);
router.get("/inSlider", getInSliderProducts);
router.get("/:productId", getProductById);
router.get("/", getProductsByQuery);
router.get("/", getAllProducts);

module.exports = router;
