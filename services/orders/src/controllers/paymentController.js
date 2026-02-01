const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if already paid
    if (order.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid',
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    // Update order with Razorpay order ID
    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id,
        orderNumber: order.orderNumber,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      order.payment.status = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update order with payment details
    order.payment.status = 'paid';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();
    
    // Confirm order after successful payment
    if (order.status === 'pending') {
      order.status = 'confirmed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
};

// Razorpay webhook handler
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

// Handle payment captured event
async function handlePaymentCaptured(payment) {
  const order = await Order.findOne({
    'payment.razorpayOrderId': payment.order_id,
  });

  if (order && order.payment.status !== 'paid') {
    order.payment.status = 'paid';
    order.payment.razorpayPaymentId = payment.id;
    order.payment.paidAt = new Date();
    
    if (order.status === 'pending') {
      order.status = 'confirmed';
    }

    await order.save();
    console.log(`Payment captured for order: ${order.orderNumber}`);
  }
}

// Handle payment failed event
async function handlePaymentFailed(payment) {
  const order = await Order.findOne({
    'payment.razorpayOrderId': payment.order_id,
  });

  if (order) {
    order.payment.status = 'failed';
    order.payment.failureReason = payment.error_description;
    await order.save();
    console.log(`Payment failed for order: ${order.orderNumber}`);
  }
}

// Handle refund created event
async function handleRefundCreated(refund) {
  const order = await Order.findOne({
    'payment.razorpayPaymentId': refund.payment_id,
  });

  if (order) {
    order.payment.status = 'refunded';
    order.payment.refundId = refund.id;
    order.payment.refundedAt = new Date();
    await order.save();
    console.log(`Refund processed for order: ${order.orderNumber}`);
  }
}

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.payment.status,
        amount: order.total,
        paidAt: order.payment.paidAt,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
    });
  }
};

// Initiate refund
exports.initiateRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is not paid',
      });
    }

    // Create refund
    const refundAmount = amount ? Math.round(amount * 100) : Math.round(order.total * 100);
    
    const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
      amount: refundAmount,
      notes: {
        reason: reason || 'Customer requested refund',
        orderId: order._id.toString(),
      },
    });

    order.payment.status = 'refunded';
    order.payment.refundId = refund.id;
    order.payment.refundedAt = new Date();
    order.status = 'cancelled';
    order.internalNote = `Refunded: ${reason || 'Customer requested refund'}`;

    await order.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Initiate refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate refund',
    });
  }
};
