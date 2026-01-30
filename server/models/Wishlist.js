import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure a user can only have one wishlist entry per product
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

// Pre-populate product info when querying
wishlistSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'product',
    select: 'name price image brand category countInStock rating numReviews',
  });
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
