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

exports.getUserById = (req, res) => {
  const { userId } = req.params;
  if (userId) {
    User.findOne({ _id: userId }).exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) return res.status(200).json({ user });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.createAdminUser = async (req, res) => {
  const { userName, password } = req.body;

  const hash_password = await bcrypt.hash(password, 10);

  const _user = new User({
    firstName: "default",
    lastName: "default",
    userName,
    email: `${userName}@gmail.com`,
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
  }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user)
      return res.status(201).json({ user, message: "Update admin success" });
  });
};

exports.deleteAdminUser = (req, res) => {
  const { userId } = req.params;
  console.log(req.params);

  User.deleteOne({ _id: userId }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) return res.status(202).json({ message: "Delete admin success" });
  });
};
