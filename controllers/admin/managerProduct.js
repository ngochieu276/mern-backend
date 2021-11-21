const Product = require("../../models/product");

exports.getProductsByQuery = (req, res) => {};

exports.createProduct = (req, res) => {
  const {
    name,
    listedPrice,
    discountPrice,
    is_hot,
    in_slider,
    avatar,
    photos,
    quantity,
    description,
    tags,
    supplier,
    profilePicture,
    createdAt,
  } = req.body;

  const _product = new Product({
    name,
    listedPrice,
    discountPrice,
    is_hot,
    in_slider,
    avatar,
    photos,
    quantity,
    description,
    tags,
    supplier,
    profilePicture,
    createdAt,
    createdBy: req.user._id,
  });

  _product.save((error, user) => {
    if (error) {
      return res.status(400).json({ message: "Something went wrong", error });
    }
    if (user) {
      return res.status(201).json({
        message: "Product create successfull",
        user,
      });
    }
  });
};

exports.updateProduct = (req, res) => {};

exports.deleteProduct = (req, res) => {};
