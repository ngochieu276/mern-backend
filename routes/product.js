const express = require("express");
const {
  getHotProducts,
  getInSliderProducts,
  getProductById,
  getProductsByQuery,
  getAllProducts,
} = require("../controllers/product");

const router = express.Router();
router.get("/", getAllProducts);

router.get("/isHot", getHotProducts);
router.get("/inSlider", getInSliderProducts);
router.get("/:productId", getProductById);
router.post("/getProductsByQuery", getProductsByQuery);

module.exports = router;
