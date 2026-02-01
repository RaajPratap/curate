// Shared configuration constants

const config = {
  // API URLs
  api: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
    orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3003',
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },

  // Sustainability ratings
  sustainability: {
    ratings: ['A', 'B', 'C', 'D', 'F'],
    thresholds: {
      A: 80,
      B: 60,
      C: 40,
      D: 20,
      F: 0,
    },
  },

  // Order statuses
  orderStatuses: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned',
  },

  // Payment statuses
  paymentStatuses: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // User roles
  userRoles: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
  },

  // Product statuses
  productStatuses: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    ARCHIVED: 'archived',
  },
};

module.exports = config;
