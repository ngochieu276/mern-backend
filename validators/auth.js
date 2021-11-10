const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");

exports.validateRegisterRequest = [
  check("email").isEmail().withMessage("Valid Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must 6 character long"),
];

exports.validateLoginRequest = [
  check("email").isEmail().withMessage("Valid Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

exports.tokenAuth = async (req, res, next) => {
	const token = req.headers.authorization;

	try {
		if (!token) throw new Error("Empty token...");

		const decodedData = jwt.verify(token, process.env.JWT_SECRET);
		const { _id } = decodedData;
		const foundUser = await User.findById(_id).select(
			"-hash_password -__v -createdAt -updatedAt"
		);
		if (!foundUser) throw new Error("User doesn't exist!");
		req.user = foundUser;

		next();
	} catch (err) {
		res.status(401).send({
			success: 0,
			message: err.message,
		});
	}
};
