import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig,
  stripeWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

// Stripe config (public)
router.get('/config', getStripeConfig);

// Protected routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);

// Webhook (raw body needed)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
