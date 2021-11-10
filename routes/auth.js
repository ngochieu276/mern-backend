const express = require("express");
const { login, register, getUserInformation, updateUser } = require("../controllers/auth");
const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../common-middleware/index");

const {
	validateLoginRequest,
	validateRegisterRequest,
	isRequestValidated,
	tokenAuth,
} = require("../validators/auth");
const router = express.Router();

router.post("/login", validateLoginRequest, isRequestValidated, login);

router.post("/register", validateRegisterRequest, isRequestValidated, register);

router.get("/me", requireSignin, getUserInformation);

// router.post("/signout", signout);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

router.put("/update", tokenAuth, updateUser);

module.exports = router;
