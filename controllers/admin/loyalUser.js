const Order = require("../../models/order");

exports.getSalesByUsers = (req, res) => {
  Order.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "buyer",
      },
    },
    {
      $group: {
        _id: "$buyer",
        totalBuy: {
          $sum: { $multiply: ["$items.payablePrice", "$items.purchaseQty"] },
        },
      },
    },
    { $sort: { totalBuy: -1 } },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};

exports.getUsersByCondition = (req, res) => {
  const { condition } = req.body;
  let valueReg;
  if (condition == "discount5") {
    valueReg = 50000;
  } else if (condition == "discount10") {
    valueReg = 250000;
  } else if (condition == "discount15") {
    valueReg = 500000;
  }
  Order.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "buyer",
      },
    },
    {
      $group: {
        _id: "$buyer",
        totalBuy: {
          $sum: { $multiply: ["$items.payablePrice", "$items.purchaseQty"] },
        },
      },
    },
    { $match: { totalBuy: { $gt: valueReg } } },
    { $sort: { totalBuy: -1 } },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};
