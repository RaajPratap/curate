// Format price with currency
const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CRT-${timestamp}-${random}`;
};

// Calculate sustainability rating from score
const getSustainabilityRating = (score) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
};

// Slugify string
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Truncate text
const truncate = (str, length = 100) => {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate carbon footprint savings
const calculateCarbonSavings = (sustainableCarbon, conventionalCarbon = null) => {
  // Average conventional clothing carbon footprint is ~10kg CO2 per item
  const conventionalDefault = conventionalCarbon || 10;
  const savings = conventionalDefault - sustainableCarbon;
  const percentageSaved = Math.round((savings / conventionalDefault) * 100);
  
  return {
    savings,
    percentage: Math.max(0, percentageSaved),
  };
};

module.exports = {
  formatPrice,
  generateOrderNumber,
  getSustainabilityRating,
  slugify,
  truncate,
  isValidEmail,
  calculateCarbonSavings,
};
