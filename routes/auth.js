const express = require("express");
const {
  login,
  register,
  getUserInformation,
  updateUser,
  changePassword,
} = require("../controllers/auth");
const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../common-middleware/index");
const {
  validateLoginRequest,
  validateRegisterRequest,
  isRequestValidated,
} = require("../validators/auth");
const router = express.Router();

router.post("/login", validateLoginRequest, isRequestValidated, login);

router.post("/register", validateRegisterRequest, isRequestValidated, register);

router.put("/update", requireSignin, userMiddleware, updateUser);
router.patch("/changePassword", requireSignin, userMiddleware, changePassword);

router.get("/me", requireSignin, getUserInformation);

// router.post("/signout", signout);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
