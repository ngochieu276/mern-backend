const Product = require("../../models/product");

exports.createProduct = (req, res) => {
  console.log(req.body);
  const { name, listedPrice, discountPrice, quantity, description, avatar } =
    req.body;

  // let photos = [];
  // if (req.files.length > 0) {
  //   photos = req.files.map((file) => {
  //     return { img: file.filename };
  //   });
  // }

  const product = new Product({
    name,
    listedPrice,
    discountPrice,
    is_hot: false,
    in_slider: false,
    avatar,
    // photos,
    quantity,
    description,
    tags: [],
    supplier: "none",
    profilePicture: "",
    createdAt: new Date(),
    createdBy: req.user._id,
  });

  product.save((err, product) => {
    if (err) return res.status(400).json({ err });
    if (product) return res.status(201).json({ product });
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
      if (users) return res.status(200).json({ products });
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { updateProduct } = req.body;

  Product.findOneAndUpdate({ _id: updateProduct.productId }, updateProduct, {
    new: true,
  }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(201).json({ product });
  });
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.status(202).json({ message: "delete success" });
  });
};
