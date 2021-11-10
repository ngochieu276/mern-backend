const User = require("../../models/user");

exports.getAllUsers = (req, res) => {
  User.find({}).exec((error, users) => {
    if (error) return res.status(400).json({ error });
    if (users) return res.status(200).json({ users });
  });
};

exports.getUsersByQuery = (req, res) => {
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
};
