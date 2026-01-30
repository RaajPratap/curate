import Wishlist from '../models/Wishlist.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id })
    .sort({ addedAt: -1 });

  res.json({
    success: true,
    count: wishlist.length,
    wishlist,
  });
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Check if item already exists in wishlist
  const existingItem = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingItem) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    product: productId,
  });

  // Populate product info before returning
  const populatedItem = await Wishlist.findById(wishlistItem._id);

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    item: populatedItem,
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const wishlistItem = await Wishlist.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!wishlistItem) {
    res.status(404);
    throw new Error('Wishlist item not found');
  }

  await wishlistItem.deleteOne();

  res.json({
    success: true,
    message: 'Product removed from wishlist',
  });
});

// @desc    Remove multiple items from wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.deleteMany({ user: req.user._id });

  res.json({
    success: true,
    message: 'Wishlist cleared',
  });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlistStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlistItem = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  res.json({
    success: true,
    isWishlisted: !!wishlistItem,
    wishlistId: wishlistItem?._id || null,
  });
});

// @desc    Get wishlist count
// @route   GET /api/wishlist/count
// @access  Private
const getWishlistCount = asyncHandler(async (req, res) => {
  const count = await Wishlist.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    count,
  });
});

// @desc    Toggle wishlist item (add if not exists, remove if exists)
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const existingItem = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingItem) {
    await existingItem.deleteOne();
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      isWishlisted: false,
    });
  } else {
    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id);

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      isWishlisted: true,
      item: populatedItem,
    });
  }
});

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus,
  getWishlistCount,
  toggleWishlist,
};
