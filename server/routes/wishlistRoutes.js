import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus,
  getWishlistCount,
  toggleWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.route('/toggle')
  .post(toggleWishlist);

router.route('/count')
  .get(getWishlistCount);

router.route('/check/:productId')
  .get(checkWishlistStatus);

router.route('/:id')
  .delete(removeFromWishlist);

export default router;
