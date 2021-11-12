const jwt = require("jsonwebtoken");

const path = require("path");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
    req.user = user;
  } else {
    return res.status(401).json({ message: "Invalid authorization" });
  }

  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "only user allow" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Access denied, only admin allow" });
  }
  next();
};
