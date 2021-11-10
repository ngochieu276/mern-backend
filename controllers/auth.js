const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.register = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) return res.status(400).json({ message: "User already register" });
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
    role: "user",
  });
  console.log(_user);

  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (data) {
      return res.status(200).json({
        message: "User create successfull",
      });
    }
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isValidPassword = user.authenticate(req.body.password);
      if (isValidPassword && user.role === "user") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        const { _id, firstName, lastName, userName, email, dob, phone, role } =
          user;

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

exports.getUserInformation = (req, res) => {
  console.log(req);
  User.findById(req.user._id)
    .select("_id firstName lastName userName email dob phone")
    .exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) return res.status(200).json({ user });
    });
};
