const express = require("express");
const {
  createProduct,
  getProductsByQuery,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../../controllers/admin/managerProduct");

const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../../common-middleware/index");

const router = express.Router();

router.get("/:productId", requireSignin, adminMiddleware, getProductById);
router.post("/create", requireSignin, adminMiddleware, createProduct);
router.post(
  "/getProductsByQuery",
  requireSignin,
  adminMiddleware,
  getProductsByQuery
);
router.put("/update", requireSignin, adminMiddleware, updateProduct);

router.delete("/delete", requireSignin, adminMiddleware, deleteProduct);

module.exports = router;
