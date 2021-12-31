const express = require("express");
const {
  getUsersByQuery,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getUserById,
  updateAllUsers,
} = require("../../controllers/admin/managerUser");

const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../../common-middleware/index");

const router = express.Router();

router.get("/adminUser/:userId", requireSignin, adminMiddleware, getUserById);
router.post(
  "/getUsersByQuery",
  requireSignin,
  adminMiddleware,
  getUsersByQuery
);
router.post(
  "/adminUser/create",
  requireSignin,
  adminMiddleware,
  createAdminUser
);
router.put(
  "/adminUser/update",
  requireSignin,
  adminMiddleware,
  updateAdminUser
);

router.delete(
  "/adminUser/:userId",
  requireSignin,
  adminMiddleware,
  deleteAdminUser
);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
