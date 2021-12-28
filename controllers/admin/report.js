const Report = require("../../models/report");
const User = require("../../models/user");

exports.getReports = (req, res) => {
  Report.find({})
    .sort({ createdAt: -1 })
    .populate("actionBy", "role userName email")
    .exec((error, reports) => {
      if (error) return res.status(400).json({ error });
      if (reports) return res.status(200).json({ reports });
    });
};

exports.advangeSearchReports = async (req, res) => {
  const { query, startDate, endDate, action, role, field } = req.body;
  let isoStartDate = new Date(startDate).toISOString();
  let isoEndDate = new Date(endDate).toISOString();
  isoStartDate = isoStartDate.slice(0, -1) + "+00:00";
  isoEndDate = isoEndDate.slice(0, -1) + "+00:00";
  if (query) {
    User.findOne({
      $or: [{ email: query }, { userName: query }],
    }).exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        Report.find({
          $and: [
            {
              actionBy: user._id,
            },
            { action: { $in: [...action] } },
            { role: { $in: [...role] } },
            { field: { $in: [...field] } },
            { createdAt: { $lte: isoEndDate } },
            { createdAt: { $gte: isoStartDate } },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("actionBy", "role userName email")
          .exec((error, reports) => {
            if (error) return res.status(400).json({ error });
            if (reports) return res.status(200).json({ reports });
          });
      } else if (!user) {
        res.status(400).json({
          error: "No user found, please write exactly userEmail or userName",
        });
      }
    });
  } else {
    Report.find({
      $and: [
        { action: { $in: [...action] } },
        { role: { $in: [...role] } },
        { field: { $in: [...field] } },
        { createdAt: { $lte: isoEndDate } },
        { createdAt: { $gte: isoStartDate } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("actionBy", "role userName email")
      .exec((error, reports) => {
        if (error) return res.status(400).json({ error });
        if (reports) return res.status(200).json({ reports });
      });
  }
};
