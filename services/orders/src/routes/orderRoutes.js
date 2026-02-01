const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
} = require('../controllers/orderController');

const router = express.Router();

// Create order from cart
router.post('/', createOrder);

// Get user's orders
router.get('/', getOrders);

// Get order by order number (for guest checkout tracking)
router.get('/track/:orderNumber', getOrderByNumber);

// Get single order by ID
router.get('/:id', getOrderById);

// Update order status (admin)
router.patch('/:id/status', updateOrderStatus);

// Update payment status
router.patch('/:id/payment', updatePaymentStatus);

// Cancel order
router.delete('/:id', cancelOrder);

module.exports = router;
