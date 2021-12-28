const Product = require("../models/product");

exports.getProducts = (req, res) => {
  const { page, perPage, name, maxPrice, minPrice, tag } = req.query;
  console.log(tag);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(perPage, 10),
  };

  if (name && maxPrice && minPrice) {
    Product.paginate(
      {
        $and: [
          { name: { $regex: new RegExp(name), $options: "i" } },
          { discountPrice: { $lte: maxPrice } },
          { discountPrice: { $gt: minPrice } },
        ],
      },
      options
    )
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else if (maxPrice && minPrice) {
    Product.paginate(
      {
        $and: [
          // { name: { $regex: new RegExp(name), $options: "i" } },
          { discountPrice: { $lte: maxPrice } },
          { discountPrice: { $gt: minPrice } },
        ],
      },
      options
    )
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else if (tag) {
    if (Array.isArray(tag)) {
      Product.paginate(
        {
          $or: [
            { tags: { $all: [...tag] } },
            { tags: { $in: tag[0] } },
            { tags: { $in: tag[1] } },
          ],
        },
        options
      )
        .then((products) => {
          res.status(200).json(products);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Product.paginate(
        {
          tags: { $in: tag },
        },
        options
      )
        .then((products) => {
          res.status(200).json(products);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    Product.paginate({}, options)
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
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

// exports.getProductsByQuery = (req, res) => {
//   const { queryStr } = req.query;
//   Product.find({
//     $or: [
//       { name: { $regex: queryStr } },
//       { description: { $regex: queryStr } },
//     ],
//   }).exec((error, products) => {
//     if (error) return res.status(400).json({ error });
//     if (products)
//       return res.status(200).json({
//         products,
//         meta: { total: products.length, skip: 6, limit: 5 },
//       });
//   });
// };

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
