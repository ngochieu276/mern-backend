const express = require("express");
const { getUsersByQuery } = require("../../controllers/admin/managerUser");

const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../../common-middleware/index");

const router = express.Router();

router.post(
  "/getUsersByQuery",
  requireSignin,
  adminMiddleware,
  getUsersByQuery
);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
