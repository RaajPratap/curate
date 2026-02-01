const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Info
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guestEmail: String,

  // Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    variant: {
      size: String,
      color: String,
    },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    sku: String,
  }],

  // Pricing
  subtotal: Number,
  discount: {
    type: Number,
    default: 0,
  },
  discountCode: String,
  shippingCost: Number,
  tax: Number,
  total: Number,
  currency: {
    type: String,
    default: 'USD',
  },

  // Addresses
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  billingAddress: {
    sameAsShipping: Boolean,
    firstName: String,
    lastName: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },

  // Payment
  payment: {
    method: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: String,
    paidAt: Date,
  },

  // Shipping
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
  }],

  // Sustainability Impact
  sustainabilityImpact: {
    totalCarbonFootprint: Number,
    carbonSavedVsConventional: Number,
  },

  // Notes
  customerNote: String,
  internalNote: String,
}, {
  timestamps: true,
});

// Add status to history when changed
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
