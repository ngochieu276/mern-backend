const express = require("express");
const {
  getProductsByQuery,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/admin/managerProduct");

const {
  requireSignin,
  adminMiddleware,
} = require("../../common-middleware/index");

const router = express.Router();

router.post(
  "/getProductsByQuery",
  requireSignin,
  adminMiddleware,
  getProductsByQuery
);

router.post("/product/create", requireSignin, adminMiddleware, createProduct);
router.post("/product/update", requireSignin, adminMiddleware, updateProduct);
router.delete("/product/delete", requireSignin, adminMiddleware, deleteProduct);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
