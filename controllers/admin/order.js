const Order = require("../../models/order");
const User = require("../../models/user");
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
      console.log(
        "Email sent: " + response.envelope.from + response.envelope.to
      );
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

exports.updateOrders = (req, res) => {
  Order.findOneAndUpdate(
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
  )
    .populate("user", "email")
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        console.log("orderemai" + order.user.email);
        sendEmai(
          order.user.email,
          `Your order status was change at ${formatDate(order.updatedAt)} to ${
            req.body.type
          }`
        );
        return res.status(201).json({ order });
      }
    });
};

exports.getCustomerOrders = async (req, res) => {
  Order.find({})
    .sort({ createdAt: -1 })
    .populate("items.productId", "_id name avatar")
    .populate("user", "userName email")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) return res.status(200).json({ orders });
    });
};

exports.getCustomerOrdersByEmail = async (req, res) => {
  if (req.body) {
    const { query } = req.body;
    const user = await User.findOne({ email: query }).exec();
    const userId = user._id;

    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "_id name avatar")
      .populate("user", "userName email")
      .exec((error, orders) => {
        if (error) return res.status(400).json({ error });
        if (orders) return res.status(200).json({ orders });
      });
  }
};

exports.getCustomOrderById = (req, res) => {
  const { orderId } = req.params;
  if (orderId) {
    Order.findOne({ _id: orderId })
      .populate("items.productId", "_id name avatar")
      .exec((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) return res.status(200).json({ order });
      });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.sortOrder = (req, res) => {
  const { orderBy } = req.params;
  Order.find({})
    .sort({ createdAt: orderBy })
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) return res.status(200).json({ orders });
    });
};
