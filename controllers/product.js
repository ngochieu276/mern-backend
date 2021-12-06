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
  if (req.body) {
    const { query } = req.body;
    Product.find({
      $or: [{ name: { $regex: query } }, { description: { $regex: query } }],
    }).exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products)
        return res
          .status(200)
          .json({ products, meta: { total: 10, skip: 10, limit: 10 } });
    });
  } else {
    Product.find({}).exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) return res.status(200).json({ products });
    });
  }
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
