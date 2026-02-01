const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getPaymentStatus,
  initiateRefund,
} = require('../controllers/paymentController');

const router = express.Router();

// Create Razorpay order for payment
router.post('/create-order', createPaymentOrder);

// Verify payment after Razorpay checkout
router.post('/verify', verifyPayment);

// Get payment status
router.get('/status/:orderId', getPaymentStatus);

// Initiate refund (admin)
router.post('/refund/:orderId', initiateRefund);

// Razorpay webhook (raw body needed for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
