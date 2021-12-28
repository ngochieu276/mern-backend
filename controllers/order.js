const Order = require("../models/order");
const Cart = require("../models/cart");
const Report = require("../models/report");

const nodemailer = require("nodemailer");

const sendEmai = (emailReceived, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: { rejectUnauthorized: false },
    auth: {
      user: "ngochieustudy@gmail.com",
      pass: "sieunhangao",
    },
  });

  const mailOptions = {
    from: "ngochieustudy@gmail.com",
    to: emailReceived,
    subject: "Your order status was change",
    text: content,
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + response.response);
    }
  });
};

const formatDate = (date) => {
  if (date) {
    const d = new Date(date);
    return `${d.getFullYear()}--${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  }
  return "";
};

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

      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          sendEmai(
            req.user.email,
            `Your order was created at ${formatDate(order.createdAt)}`
          );
          const report = new Report({
            actionBy: req.user._id,
            action: "create",
            field: "order",
            content: {
              role: req.user.role,
              userName: req.user.userName,
              orderId: order._id,
            },
          });
          report.save();
          return res.status(201).json({ order });
        }
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
        return res.status(200).json({ order });
      }
    });
};
