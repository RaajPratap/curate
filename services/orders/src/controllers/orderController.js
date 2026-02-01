const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CUR-${timestamp}-${random}`;
};

// Calculate shipping cost (free over 2999 INR)
const calculateShipping = (subtotal, method = 'standard') => {
  if (subtotal >= 2999) return 0;
  
  const rates = {
    standard: 99,
    express: 199,
    overnight: 399,
  };
  
  return rates[method] || rates.standard;
};

// Calculate tax (18% GST for India)
const calculateTax = (subtotal) => {
  return Math.round(subtotal * 0.18);
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      guestEmail,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      customerNote,
    } = req.body;

    // Find cart
    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate pricing
    const subtotal = cart.subtotal;
    const shippingCost = calculateShipping(subtotal, shippingMethod);
    const tax = calculateTax(subtotal);
    const total = subtotal + shippingCost + tax;

    // Map cart items to order items
    const items = cart.items.map(item => ({
      product: item.product._id || item.product,
      variant: item.variant,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      sku: `${item.product.slug || 'PROD'}-${item.variant?.size || 'OS'}-${item.variant?.color || 'DEF'}`.toUpperCase(),
    }));

    // Calculate sustainability impact
    const sustainabilityImpact = {
      totalCarbonFootprint: items.reduce((acc, item) => acc + (item.quantity * 2.5), 0), // kg CO2
      carbonSavedVsConventional: items.reduce((acc, item) => acc + (item.quantity * 5.2), 0), // kg CO2 saved
    };

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: userId || undefined,
      guestEmail: guestEmail || undefined,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      currency: 'INR',
      shippingAddress,
      billingAddress: billingAddress?.sameAsShipping 
        ? { ...shippingAddress, sameAsShipping: true }
        : billingAddress,
      payment: {
        method: paymentMethod,
        status: 'pending',
      },
      shipping: {
        method: shippingMethod || 'standard',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      status: 'pending',
      sustainabilityImpact,
      customerNote,
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndDelete(query);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify ownership (if userId provided)
    if (userId && order.user?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
    });
  }
};

// Get order by order number (for guest checkout)
exports.getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // For guest orders, verify email
    if (order.guestEmail && email !== order.guestEmail) {
      return res.status(403).json({
        success: false,
        message: 'Email does not match order',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
    });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned'],
      cancelled: [],
      returned: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    // Update order
    order.status = status;

    // Add note to status history if provided
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
    }

    // Update shipping info if provided
    if (status === 'shipped') {
      order.shipping.shippedAt = new Date();
      if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
      if (trackingUrl) order.shipping.trackingUrl = trackingUrl;
    }

    if (status === 'delivered') {
      order.shipping.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify ownership
    if (userId && order.user?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    order.status = 'cancelled';
    order.internalNote = reason ? `Cancelled by user: ${reason}` : 'Cancelled by user';

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, stripePaymentIntentId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.payment.status = status;
    
    if (stripePaymentIntentId) {
      order.payment.stripePaymentIntentId = stripePaymentIntentId;
    }

    if (status === 'paid') {
      order.payment.paidAt = new Date();
      // Auto-confirm order when paid
      if (order.status === 'pending') {
        order.status = 'confirmed';
      }
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated',
      data: { order },
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
    });
  }
};
