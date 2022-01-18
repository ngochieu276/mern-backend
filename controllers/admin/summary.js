const Order = require("../../models/order");
const getIsoTime = (time) => {
  return new Date(time).toISOString().slice(0, -1) + "+00:00";
};

exports.getBestSalesProduct = async (req, res) => {
  const { month } = req.body;
  Order.aggregate([
    { $match: { status: "completed", monthComplete: month } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        items: 1,
        quantity: "$items.purchaseQty",
        productName: "$product.name",
      },
    },
    {
      $group: {
        _id: "$productName",
        totalQuantity: { $sum: "$quantity" },
        totalSale: {
          $sum: { $multiply: ["$items.payablePrice", "$quantity"] },
        },
      },
    },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};

exports.getSaleByDay = async (req, res) => {
  const { month } = req.body;
  Order.aggregate([
    { $match: { status: "completed", monthComplete: month } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$dayComplete",
        totalSale: {
          $sum: { $multiply: ["$items.payablePrice", "$items.purchaseQty"] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};

exports.getSalesByMonth = async (req, res) => {
  Order.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$monthComplete",
        totalSale: {
          $sum: { $multiply: ["$items.payablePrice", "$items.purchaseQty"] },
        },
        totalQuantity: {
          $sum: "$items.purchaseQty",
        },
      },
    },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};

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

exports.getPopulateTags = (req, res) => {
  const { daysAgo } = req.body;
  let rightNow = new Date().getTime();
  const daysAgoStr = new Date(rightNow - 1000 * 60 * 60 * 24 * daysAgo);
  const daysAgoIso = getIsoTime(daysAgoStr);
  console.log(daysAgoIso);

  Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        items: 1,
        quantity: "$items.purchaseQty",
        productName: "$product.name",
        productTags: "$product.tags",
        isOnDate: { $gt: ["$createdAt", daysAgoStr] },
      },
    },
    { $match: { isOnDate: true } },
    { $unwind: "$productTags" },
    { $unwind: "$productTags" },
    {
      $group: {
        _id: "$productTags",
        totalCount: { $sum: "$quantity" },
      },
    },
    { $sort: { totalCount: -1 } },
    { $limit: 7 },
  ]).exec((error, results) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (results) {
      return res.status(200).json({ results });
    }
  });
};

exports.getRebuyPercent = (req, res) => {
  const { atLeast } = req.body;
  if (atLeast) {
    Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$user",
          buyTimes: { $sum: 1 },
        },
      },
      {
        $facet: {
          data: [
            {
              $bucket: {
                groupBy: "$buyTimes",
                boundaries: [1, 2, atLeast, Infinity],
              },
            },
          ],
        },
      },
    ]).exec((error, results) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (results) {
        return res.status(200).json({ results });
      }
    });
  } else {
    Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$user",
          buyTimes: { $sum: 1 },
        },
      },
      {
        $facet: {
          data: [
            {
              $bucket: {
                groupBy: "$buyTimes",
                boundaries: [1, 2, Infinity],
              },
            },
          ],
        },
      },
    ]).exec((error, results) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (results) {
        return res.status(200).json({ results });
      }
    });
  }
};
