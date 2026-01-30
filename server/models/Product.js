import mongoose from 'mongoose';

// Flexible product schema to support both old and synthetic data structures
const productSchema = new mongoose.Schema({
  // Basic info (both schemas)
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: false,
  },
  
  // Category (synthetic uses categoryId, old uses category string)
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  
  // Brand
  brand: {
    type: String,
    required: false,
  },
  
  // Images (synthetic uses array, old uses single string)
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  image: {
    type: String,
    required: false,
  },
  
  // Price (synthetic uses object, old uses number)
  price: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: 0,
  },
  
  // Inventory (synthetic uses object, old uses countInStock)
  inventory: {
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    isAvailable: { type: Boolean, default: true },
  },
  countInStock: {
    type: Number,
    default: 0,
  },
  
  // Ratings (synthetic uses object, old uses separate fields)
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  
  // Reviews
  reviews: [{
    name: String,
    rating: Number,
    comment: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  
  // Tags and attributes
  tags: [{
    type: String,
  }],
  attributes: {
    color: String,
    size: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  
  // Status flags
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  
  // Reference to creator (for admin purposes)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  timestamps: true,
});

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
