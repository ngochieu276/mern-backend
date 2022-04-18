const Cart = require("../models/cart");

const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId: userId })
    .select("-__v")
    .populate({
      path: "products.product",
      select: "-__v",
    })
    .lean();

  if (!cart) throw new Error("Empty cart");

  const calculateTotal = (array) => {
    const listed = array
      .map((e) => e.product.listedPrice * e.quantity)
      .reduce((prev, current) => prev + current, 0);

    const discount = array
      .map((e) => e.product.discountPrice * e.quantity)
      .reduce((prev, current) => prev + current, 0);

    return {
      listedTotal: listed,
      discountTotal: discount,
    };
  };

  const { listedTotal, discountTotal } = calculateTotal(cart.products);

  cart.itemCount = cart.products.length;
  cart.listedTotal = listedTotal;
  cart.discountTotal = discountTotal;

  return cart;
};

const addToCart = async ({ userId, productId, quantity }) => {
  const cart = await Cart.findOne({ userId: userId });
  const item = {
    product: productId,
    quantity,
  };

  // Create cart if there is none
  if (!cart) {
    const newCart = await Cart.create({
      userId,
      products: [item],
    });

    return newCart;
  }

  let itemExisted = false;
  // Add quantity if item already in cart
  cart.products.forEach((product) => {
    console.log("58", product);
    if (product.product.toString() === productId) {
      product.quantity += quantity;
      itemExisted = true;
    }
  });

  // Add item to cart
  if (!itemExisted) {
    cart.products.push(item);
  }

  await cart.save();

  return cart;
};

const removeItem = async ({ userId, productId }) => {
  const cart = await Cart.findOne({ userId: userId });

  if (!cart) throw new Error("Empty cart");

  cart.products = cart.products.filter(
    (product) => product.product.toString() !== productId
  );

  if (!cart.products.length) {
    await clearCart(userId);
    return null;
  }

  await cart.save();

  return cart;
};

const updateQuantity = async ({ userId, productId, quantity }) => {
  const cart = await Cart.findOne({ userId: userId });

  if (!cart) throw new Error("Empty cart");

  // remove item if quantity < 0
  if (!quantity) {
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== productId
    );
  }
  // else update quantity
  else {
    cart.products = cart.products.map((product) => {
      if (product.product.toString() == productId) {
        product.quantity = quantity;
      }
      return product;
    });
  }

  await cart.save();

  return cart;
};

const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ userId });
};

module.exports = { getCart, addToCart, removeItem, updateQuantity, clearCart };
