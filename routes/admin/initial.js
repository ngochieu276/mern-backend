const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const { initialData } = require("../../controllers/admin/initial");
const router = express.Router();

router.get("/initialData", requireSignin, adminMiddleware, initialData);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
