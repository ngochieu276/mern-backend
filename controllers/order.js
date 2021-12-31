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
      console.log("Email senttttttttttttttt: " + response.response);
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
          type: "in_progress",
          isCompleted: false,
        },
        {
          type: "completed",
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
            isChecked: false,
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
  const { page, perPage } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(perPage, 10),
    populate: "items.productId",
    sort: { createdAt: -1 },
  };
  Order.paginate({ user: req.user._id }, options)
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getOrder = (req, res) => {
  const { orderId } = req.params;
  Order.findOne({ _id: orderId })
    .populate("items.productId", "_id name avatar")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        return res.status(200).json({ order });
      }
    });
};

exports.cancelOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        if (order.status === "in_progress") {
          return res
            .status(400)
            .json({ message: "Already in process,cannot cancel" });
        } else {
          Order.findOneAndUpdate(
            { _id: order._id },
            {
              $set: {
                status: "cancelled",
                isCancel: true,
              },
            }
          )
            .populate("items.productId")
            .exec((error, order) => {
              if (error) return res.status(400).json({ error });
              if (order) {
                sendEmai(
                  req.user.email,
                  `You was cancel an order at ${formatDate(
                    order.updatedAt
                  )} , to re-buy, click here`
                );
                const report = new Report({
                  actionBy: req.user._id,
                  action: "delete",
                  field: "order",
                  isChecked: false,
                  content: {
                    userName: req.user.userName,
                    role: req.user.role,
                    orderId: order._id,
                    type: "cancel",
                  },
                });
                report.save();
                return res
                  .status(201)
                  .json({ order, message: "Success cancelled order" });
              }
            });
        }
      }
    });
};
