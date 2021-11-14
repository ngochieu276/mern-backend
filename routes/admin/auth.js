const express = require("express");
const { login, register, logout } = require("../../controllers/admin/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
  isRequestValidated,
} = require("../../validators/auth");
const router = express.Router();

router.post("/login", validateLoginRequest, isRequestValidated, login);

router.post("/register", validateRegisterRequest, isRequestValidated, register);

router.post("/logout", logout);

// router.post("/signout", signout);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
