const express = require("express");
const {
  getAllUsers,
  getUsersByQuery,
} = require("../../controllers/admin/managerUser");

const router = express.Router();

router.get("/getAllUsers", getAllUsers);

router.post("/getUsersByQuery", getUsersByQuery);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
