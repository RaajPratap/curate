import { ordersApi } from "./client";
import { Product } from "@/components/product";

// Session ID for guest cart tracking
const getSessionId = () => {
  if (typeof window === "undefined") return null;
  let sessionId = localStorage.getItem("cartSessionId");
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("cartSessionId", sessionId);
  }
  return sessionId;
};

export interface CartItemVariant {
  size?: string;
  color?: string;
}

export interface BackendCartItem {
  _id: string;
  product: string | Product;
  variant?: CartItemVariant;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface BackendCart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: BackendCartItem[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  variant?: CartItemVariant;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  payment: {
    method: string;
    status: "pending" | "paid" | "failed" | "refunded";
    paidAt?: string;
  };
  shipping: {
    method: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  sustainabilityImpact?: {
    totalCarbonFootprint: number;
    carbonSavedVsConventional: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Helper to get auth headers
const getAuthParams = () => {
  const userId = localStorage.getItem("userId");
  const sessionId = getSessionId();
  return { userId, sessionId };
};

export const ordersService = {
  // ============ Cart Operations ============

  // Get cart
  getCart: async (): Promise<{
    success: boolean;
    data: { cart: BackendCart };
  }> => {
    const { userId, sessionId } = getAuthParams();
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (sessionId) params.append("sessionId", sessionId);

    return ordersApi.get(`/api/cart?${params.toString()}`);
  },

  // Add item to cart - matches POST /api/cart/items
  addToCart: async (
    productId: string,
    variant: CartItemVariant,
    quantity: number,
    price: number,
    name: string,
    image?: string,
  ): Promise<{ success: boolean; data: { cart: BackendCart } }> => {
    const { userId, sessionId } = getAuthParams();

    return ordersApi.post("/api/cart/items", {
      userId,
      sessionId,
      productId,
      variant,
      quantity,
      price,
      name,
      image,
    });
  },

  // Update cart item - matches PUT /api/cart/items/:itemId
  updateCartItem: async (
    itemId: string,
    quantity: number,
  ): Promise<{ success: boolean; data: { cart: BackendCart } }> => {
    const { userId, sessionId } = getAuthParams();

    return ordersApi.put(`/api/cart/items/${itemId}`, {
      userId,
      sessionId,
      quantity,
    });
  },

  // Remove item from cart - matches DELETE /api/cart/items/:itemId
  removeFromCart: async (
    itemId: string,
  ): Promise<{ success: boolean; data: { cart: BackendCart } }> => {
    const { userId, sessionId } = getAuthParams();

    // Note: DELETE with body requires special handling
    return ordersApi.post(`/api/cart/items/${itemId}/remove`, {
      userId,
      sessionId,
    });
  },

  // Clear cart - matches DELETE /api/cart
  clearCart: async (): Promise<{ success: boolean }> => {
    const { userId, sessionId } = getAuthParams();

    return ordersApi.post("/api/cart/clear", {
      userId,
      sessionId,
    });
  },

  // ============ Order Operations ============

  // Create order - matches POST /api/orders
  createOrder: async (data: {
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    shippingMethod?: string;
    paymentMethod: string;
    guestEmail?: string;
    customerNote?: string;
  }): Promise<{ success: boolean; data: { order: Order } }> => {
    const { userId, sessionId } = getAuthParams();

    return ordersApi.post("/api/orders", {
      userId,
      sessionId,
      ...data,
    });
  },

  // Get user's orders - matches GET /api/orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    success: boolean;
    data: { orders: Order[]; pagination: any };
  }> => {
    const { userId } = getAuthParams();
    const queryParams = new URLSearchParams();

    if (userId) queryParams.append("userId", userId);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.status) queryParams.append("status", params.status);

    return ordersApi.get(`/api/orders?${queryParams.toString()}`);
  },

  // Get order by ID - matches GET /api/orders/:id
  getOrder: async (
    id: string,
  ): Promise<{ success: boolean; data: { order: Order } }> => {
    const { userId } = getAuthParams();
    const params = userId ? `?userId=${userId}` : "";

    return ordersApi.get(`/api/orders/${id}${params}`);
  },

  // Get order by order number (for tracking) - matches GET /api/orders/track/:orderNumber
  getOrderByNumber: async (
    orderNumber: string,
    email?: string,
  ): Promise<{ success: boolean; data: { order: Order } }> => {
    const params = email ? `?email=${encodeURIComponent(email)}` : "";

    return ordersApi.get(`/api/orders/track/${orderNumber}${params}`);
  },

  // Cancel order - matches DELETE /api/orders/:id
  cancelOrder: async (
    id: string,
    reason?: string,
  ): Promise<{ success: boolean; data: { order: Order } }> => {
    const { userId } = getAuthParams();

    // Backend uses DELETE for cancel
    return ordersApi.delete(
      `/api/orders/${id}?userId=${userId}&reason=${encodeURIComponent(reason || "")}`,
    );
  },
};
