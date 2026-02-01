import { productsApi } from './client'
import { Product } from '@/components/product'

export interface ProductsResponse {
  success: boolean
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  category?: string
  ecoRating?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'eco-rating'
  page?: number
  limit?: number
}

export const productsService = {
  getProducts: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    return productsApi.get<ProductsResponse>(`/api/products?${params.toString()}`)
  },

  getProduct: (slug: string) =>
    productsApi.get<{ success: boolean; product: Product }>(`/api/products/${slug}`),

  getFeatured: () =>
    productsApi.get<{ success: boolean; products: Product[] }>('/api/products/featured'),

  getDrops: () =>
    productsApi.get<{ success: boolean; products: Product[] }>('/api/products/drops'),

  getCategories: () =>
    productsApi.get<{ success: boolean; categories: string[] }>('/api/products/categories'),

  search: (query: string) =>
    productsApi.get<{ success: boolean; products: Product[] }>(
      `/api/products/search?q=${encodeURIComponent(query)}`
    ),
}
