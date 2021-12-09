const Product = require("../models/product");

exports.getAllProducts = (req, res) => {
  Product.find({}).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) return res.status(200).json({ products });
  });
};

exports.getProductById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) return res.status(200).json({ product });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.getProductsByQuery = (req, res) => {
  const { queryString } = req.query;
  Product.find({
    $or: [
      { name: { $regex: queryString } },
      { description: { $regex: queryString } },
    ],
  }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products)
      return res.status(200).json({
        products,
        meta: { total: products.length, skip: 6, limit: 5 },
      });
  });
};

exports.getHotProducts = (req, res) => {
  Product.find({ is_hot: true }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) return res.status(200).json({ products });
  });
};

exports.getInSliderProducts = (req, res) => {
  Product.find({ in_slider: true }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) return res.status(200).json({ products });
  });
};
