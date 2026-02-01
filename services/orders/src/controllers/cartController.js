const Cart = require("../models/Cart");

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;

    const query = userId ? { user: userId } : { sessionId };
    let cart = await Cart.findOne(query).populate("items.product");

    if (!cart) {
      cart = { items: [], subtotal: 0 };
    }

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      productId,
      variant,
      quantity,
      price,
      name,
      image,
    } = req.body;

    const query = userId ? { user: userId } : { sessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        sessionId: sessionId || undefined,
        items: [],
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.size === variant?.size &&
        item.variant?.color === variant?.color,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        variant,
        quantity,
        price,
        name,
        image,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart",
      data: { cart },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

// Update item quantity
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, sessionId, quantity } = req.body;

    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
      data: { cart },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, sessionId } = req.body.userId ? req.body : req.query;

    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body.userId ? req.body : req.query;

    const query = userId ? { user: userId } : { sessionId };
    await Cart.findOneAndDelete(query);

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
