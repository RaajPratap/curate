import stripePackage from 'stripe';
import Order from '../models/Order.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise/cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || 'pending',
        userId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: error.message 
    });
  }
};

// @desc    Confirm payment and create order
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderItems, shippingAddress, totalPrice } = req.body;

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: 'Payment not completed' 
      });
    }

    // Create order in database
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: 'Payment successful and order created',
      order: createdOrder,
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
export const getStripeConfig = async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

// @desc    Webhook for Stripe events
// @route   POST /api/payments/webhook
// @access  Public (Stripe only)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order status if needed
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
