const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth API
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: (id) => apiRequest(`/products/${id}`),

  createProduct: (productData) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  createReview: (id, reviewData) =>
    apiRequest(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
};

// Orders API
export const ordersAPI = {
  getOrders: () => apiRequest('/orders'),

  getOrderById: (id) => apiRequest(`/orders/${id}`),

  createOrder: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateOrderToPaid: (id, paymentResult) =>
    apiRequest(`/orders/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentResult),
    }),

  updateOrderToDelivered: (id) =>
    apiRequest(`/orders/${id}/deliver`, {
      method: 'PUT',
    }),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (amount, currency = 'inr', shipping, items) =>
    apiRequest('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents/paise
        currency,
        shipping,
        items: items.map((item) => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    }),

  confirmPayment: (paymentIntentId) =>
    apiRequest(`/payments/confirm-payment/${paymentIntentId}`, {
      method: 'POST',
    }),

  getPaymentStatus: (paymentIntentId) =>
    apiRequest(`/payments/status/${paymentIntentId}`),
};
