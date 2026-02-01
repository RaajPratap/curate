const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },

  // Profile
  firstName: String,
  lastName: String,
  avatar: String,
  phone: String,
  dateOfBirth: Date,

  // Authentication
  role: {
    type: String,
    enum: ['customer', 'admin', 'superadmin'],
    default: 'customer',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // OAuth
  googleId: String,
  appleId: String,

  // Addresses
  addresses: [{
    label: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean,
  }],

  // Preferences
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    sustainabilityAlerts: { type: Boolean, default: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  },

  // Sustainability Impact
  impact: {
    totalCarbonSaved: { type: Number, default: 0 },
    totalWaterSaved: { type: Number, default: 0 },
    sustainabilityScore: { type: Number, default: 0 },
    badges: [{
      name: String,
      earnedAt: Date,
    }],
  },

  // Wishlist
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],

  // Meta
  lastLogin: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name virtual
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.username || 'User';
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
