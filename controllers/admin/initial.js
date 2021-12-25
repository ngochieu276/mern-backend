const Order = require("../../models/order");
const User = require("../../models/order");
const Post = require("../../models/order");
const Product = require("../../models/order");

exports.initialData = async (req, res) => {
  const users = await User.find({}).exec();
  const posts = await Post.find({}).exec();
  const products = await Product.find({}).sort({ createdAt: -1 }).exec();
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("items.productId", "_id name avatar")
    .populate("user", "userName email")
    .exec();

  res.status(200).json({ users, posts, products, orders });
};
