const Order = require("../../models/order");

exports.updateOrders = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, "orderStatus.type": req.body.type },
    {
      $set: {
        "orderStatus.$": {
          date: new Date(),
          type: req.body.type,
          isCompleted: true,
        },
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) return res.status(201).json({ order });
  });
};

exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({ orders });
};

exports.getCustomOrderById = (req, res) => {
  const { orderId } = req.params;
  if (orderId) {
    Order.findOne({ _id: orderId }).exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) return res.status(200).json({ order });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
