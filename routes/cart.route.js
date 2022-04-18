const express = require("express");
const CartController = require("../controllers/cart.controller");
const { requireSignin } = require("../common-middleware/index");

const router = express.Router();

router.get("/", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await CartController.getCart(userId);

    res.send({
      success: 1,
      data: cart,
    });
  } catch (err) {
    res.send({
      success: 1,
      message: err.message,
    });
  }
});

router.post("/", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    console.log({ userId, productId, quantity });
    const newCart = await CartController.addToCart({
      userId,
      productId,
      quantity,
    });
    res.send({
      success: 1,
      data: newCart,
    });
  } catch (err) {
    res.status(500).send({
      success: 0,
      message: err.message,
    });
  }
});

router.put("/item/remove", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const newCart = await CartController.removeItem({ userId, productId });

    if (!newCart) {
      res.send({
        success: 1,
        message: "Empty cart",
      });
    }

    res.send({
      success: 1,
      data: newCart,
    });
  } catch (err) {
    res.status(500).send({
      success: 0,
      message: err.message,
    });
  }
});

router.put("/item/update", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const newCart = await CartController.updateQuantity({
      userId,
      productId,
      quantity,
    });

    res.send({
      success: 1,
      data: newCart,
    });
  } catch (err) {
    res.status(400).send({
      success: 0,
      message: err.message,
    });
  }
});

router.delete("/", requireSignin, async (req, res) => {
  try {
    const userId = req.user._id;
    await CartController.clearCart(userId);

    res.send({
      success: 1,
      message: "Cart cleared",
    });
  } catch (err) {
    res.status(500).send({
      success: 0,
      message: err.message,
    });
  }
});

module.exports = router;
