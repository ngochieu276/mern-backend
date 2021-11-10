const express = require("express");
const { login, register, updateUser, getUser } = require("../controllers/auth");
const {
	validateLoginRequest,
	validateRegisterRequest,
	isRequestValidated,
	tokenAuth,
} = require("../validators/auth");
const router = express.Router();

router.post("/login", validateLoginRequest, isRequestValidated, login);

router.post("/register", validateRegisterRequest, isRequestValidated, register);

// router.post("/signout", signout);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

router.post("/update", tokenAuth, updateUser);

router.get("/me", tokenAuth, getUser);

module.exports = router;
