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
    receivedEmail: true,
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
          {
            _id: user._id,
            role: user.role,
            email: user.email,
            userName: user.userName,
            isMng: user.isMng,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30m",
          }
        );
        console.log("á");

        const {
          _id,
          firstName,
          lastName,
          userName,
          email,
          dob,
          phone,
          role,
          isMng,
        } = user;
        res.cookie("token", token, { expiresIn: "30m" });

        res.status(200).json({
          token,
          expiresIn: {
            now: new Date().getTime(),
            then: new Date().getTime() + 30 * 60,
          },
          user: {
            _id,
            firstName,
            lastName,
            userName,
            email,
            dob,
            phone,
            role,
            isMng,
          },
        });
      } else {
        return res.status(400).json({
          error: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({ error: "No user found" });
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signout successfully" });
  console.log(res);
};
