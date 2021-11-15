const User = require("../../models/user");

const bcrypt = require("bcrypt");

exports.getUsersByQuery = (req, res) => {
  if (req.body) {
    const { query } = req.body;
    User.find({
      $or: [
        { userName: { $regex: query } },
        { email: { $regex: query } },
        { role: { $regex: query } },
        { phone: { $regex: query } },
      ],
    }).exec((error, users) => {
      if (error) return res.status(400).json({ error });
      if (users)
        return res
          .status(200)
          .json({ users, meta: { total: 10, skip: 10, limit: 10 } });
    });
  } else {
    User.find({}).exec((error, users) => {
      if (error) return res.status(400).json({ error });
      if (users) return res.status(200).json({ users });
    });
  }
};

exports.createAdminUser = async (req, res) => {
  const { userName, password } = req.body;

  const hash_password = await bcrypt.hash(password, 10);

  const _user = new User({
    firstName: "default",
    lastName: "default",
    userName,
    email: "default",
    dob: new Date(),
    phone: "default",
    hash_password,
    role: "admin",
    createdBy: req.user._id,
  });

  _user.save((error, user) => {
    if (error) {
      return res.status(400).json({ message: "Something went wrong", error });
    }
    if (user) {
      return res.status(201).json({
        message: "Admin create successfull",
        user,
      });
    }
  });
};
exports.updateAdminUser = async (req, res) => {
  const { updateUser } = req.body;

  User.findOneAndUpdate({ _id: updateUser.userId }, updateUser, {
    new: true,
  }).exec((user, error) => {
    if (error) return res.status(400).json({ error });
    if (user) return res.json(201).json({ user });
  });
};

exports.deleteAdminUser = (req, res) => {
  const { userId } = req.body;
  User.deleteOne({ _id: userId }).exec((user, error) => {
    if (error) return res.status(400).json({ error });
    if (user) return res.json(202).json({ message: "delete success" });
  });
};
