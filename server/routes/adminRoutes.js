import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserAdmin,
  toggleUserActive,
  getAllOrders,
  getRecentActivity,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect, admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);

// User management routes
router.route('/users').get(getAllUsers);
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);
router.put('/users/:id/toggle-admin', toggleUserAdmin);
router.put('/users/:id/toggle-active', toggleUserActive);

// Order management routes
router.get('/orders', getAllOrders);

export default router;
