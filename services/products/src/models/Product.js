const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  shortDescription: String,

  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  compareAtPrice: Number,
  currency: {
    type: String,
    default: 'USD',
  },

  // Inventory
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  barcode: String,
  trackInventory: {
    type: Boolean,
    default: true,
  },

  // Variants
  variants: [{
    size: String,
    color: {
      name: String,
      hex: String,
    },
    sku: String,
    price: Number,
    stock: {
      type: Number,
      default: 0,
    },
    images: [String],
  }],

  // Media
  images: [{
    url: String,
    alt: String,
    order: Number,
  }],
  video: String,

  // Categorization
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [String],
  brand: String,

  // Sustainability (Critical for this platform)
  sustainability: {
    impactScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    rating: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
    },
    carbonFootprint: {
      production: Number,
      shipping: Number,
      total: Number,
    },
    materials: [{
      name: String,
      percentage: Number,
      isRecycled: Boolean,
      isOrganic: Boolean,
      certification: String,
    }],
    manufacturing: {
      country: String,
      factory: String,
      fairTrade: Boolean,
    },
    packaging: {
      recyclable: Boolean,
      compostable: Boolean,
      plasticFree: Boolean,
    },
    certifications: [String],
  },

  // Product Details
  details: {
    fit: String,
    careInstructions: [String],
    madeIn: String,
  },

  // Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isLimitedEdition: {
    type: Boolean,
    default: false,
  },
  dropDate: Date,

  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
}, {
  timestamps: true,
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Calculate total stock
productSchema.virtual('totalStock').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
});

// Check if in stock
productSchema.virtual('inStock').get(function() {
  return this.totalStock > 0;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ 'sustainability.rating': 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1 });

// Ensure virtuals are included
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
