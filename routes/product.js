const express = require("express");
const {
  getHotProducts,
  getInSliderProducts,
  getProductById,
  getProductsByQuery,
  getAllProducts,
} = require("../controllers/product");

const router = express.Router();
router.get("/", getProductsByQuery);
router.get("/getAll", getAllProducts);
router.get("/isHot", getHotProducts);
router.get("/inSlider", getInSliderProducts);
router.get("/:productId", getProductById);

module.exports = router;
