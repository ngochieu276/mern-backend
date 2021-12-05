const Order = require("../models/order");
const Cart = require("../models/cart");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ userId: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          isCompleted: true,
          date: new Date(),
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = new Order(req.body);

      console.log();
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) return res.status(201).json({ order });
      });
    }
  });
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus paymentType orderStatus items")
    .populate("items.productId", "_id name avatar")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name avatar")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.address.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
