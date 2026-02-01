import { ordersApi } from './client'
import { Product } from '@/components/product'

export interface CartItem {
  productId: string
  product?: Product
  size: string
  quantity: number
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  carbonFootprint: number
}

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping: number
  tax: number
  total: number
  sustainabilityImpact: {
    carbonFootprint: number
    carbonOffset: boolean
    packagingType: string
  }
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  createdAt: string
}

export const ordersService = {
  // Cart
  getCart: () =>
    ordersApi.get<{ success: boolean; cart: Cart }>('/api/cart'),

  addToCart: (productId: string, size: string, quantity: number) =>
    ordersApi.post<{ success: boolean; cart: Cart }>('/api/cart/add', {
      productId,
      size,
      quantity,
    }),

  updateCartItem: (productId: string, size: string, quantity: number) =>
    ordersApi.patch<{ success: boolean; cart: Cart }>('/api/cart/update', {
      productId,
      size,
      quantity,
    }),

  removeFromCart: (productId: string, size: string) =>
    ordersApi.delete<{ success: boolean; cart: Cart }>(
      `/api/cart/remove?productId=${productId}&size=${size}`
    ),

  clearCart: () =>
    ordersApi.delete<{ success: boolean }>('/api/cart/clear'),

  // Orders
  createOrder: (data: {
    shippingAddress: Order['shippingAddress']
    paymentMethodId: string
    carbonOffset?: boolean
  }) =>
    ordersApi.post<{ success: boolean; order: Order; clientSecret: string }>(
      '/api/orders',
      data
    ),

  getOrders: () =>
    ordersApi.get<{ success: boolean; orders: Order[] }>('/api/orders'),

  getOrder: (id: string) =>
    ordersApi.get<{ success: boolean; order: Order }>(`/api/orders/${id}`),

  cancelOrder: (id: string) =>
    ordersApi.post<{ success: boolean; order: Order }>(`/api/orders/${id}/cancel`, {}),
}
