const Report = require("../../models/report");
const User = require("../../models/user");

exports.getReports = async (req, res) => {
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
  let isoStartDate = new Date(startDate).getTime();
  isoStartDate = new Date(isoStartDate - 1000 * 60 * 60 * 7).toISOString();
  isoStartDate = isoStartDate.slice(0, -1) + "+00:00";
  let isoEndDate = new Date(endDate).getTime();
  isoEndDate = new Date(isoEndDate - 1000 * 60 * 60 * 7).toISOString();
  isoEndDate = isoEndDate.slice(0, -1) + "+00:00";
  console.log(query);
  if (query) {
    User.findOne({
      $or: [{ email: query }, { userName: query }],
    }).exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        console.log(user);
        Report.find({
          $and: [
            {
              actionBy: user._id,
            },
            { action: { $in: [...action] } },
            { field: { $in: [...field] } },
            { createdAt: { $lte: isoEndDate } },
            { createdAt: { $gte: isoStartDate } },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("actionBy", "role userName email")
          .exec((error, reports) => {
            console.log(reports);
            if (error) return res.status(400).json({ error });
            if (reports) return res.status(200).json({ reports });
          });
      } else if (!user) {
        res.status(400).json({
          error: "No user found, please write exactly userEmail or userName",
        });
      }
    });
  } else if (!query && role.length == 1) {
    try {
      let reports = await Report.find({
        $and: [
          { action: { $in: [...action] } },
          { field: { $in: [...field] } },
          { createdAt: { $lt: isoEndDate } },
          { createdAt: { $gt: isoStartDate } },
        ],
      })
        .sort({ createdAt: -1 })
        .populate("actionBy", "role userName email");

      if (reports) {
        console.log(reports);
        let returnReports = reports.filter(
          (report) => report.actionBy.role === role[0]
        );

        return res.status(200).json({ reports: returnReports });
      }
    } catch (err) {
      res.stastus(400).json({ err });
    }
  } else {
    Report.find({
      $and: [
        { action: { $in: [...action] } },
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

exports.updateReportsToChecked = async (req, res) => {
  Report.updateMany({ isChecked: false }, { $set: { isChecked: true } })
    .populate("actionBy", "role userName email")
    .exec((error, reports) => {
      if (error) return res.status(400).json({ error });
      if (reports) return res.status(200).json({ reports });
    });
};
