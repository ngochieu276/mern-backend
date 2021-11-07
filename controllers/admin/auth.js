const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({ message: "Admin already register" });
  });

  const { firstName, lastName, userName, email, password, dob, phone } =
    req.body;

  const hash_password = await bcrypt.hash(password, 10);

  const _user = new User({
    firstName,
    lastName,
    userName,
    email,
    dob,
    phone,
    hash_password,
    role: "admin",
  });

  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    if (data) {
      return res.status(201).json({
        message: "Admin create successfull",
      });
    }
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isValidPassword = await user.authenticate(req.body.password);
      if (isValidPassword && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        const { _id, firstName, lastName, userName, email, dob, phone, role } =
          user;
        res.cookie("token", token, { expiresIn: "1d" });

        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            userName,
            email,
            dob,
            phone,
            role,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong " });
    }
  });
};
