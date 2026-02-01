import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@/components/product'

interface ProductsState {
  items: Product[]
  featured: Product[]
  current: Product | null
  filters: {
    category: string | null
    ecoRating: string | null
    priceRange: [number, number] | null
    sortBy: 'newest' | 'price-asc' | 'price-desc' | 'eco-rating'
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  isLoading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  featured: [],
  current: null,
  filters: {
    category: null,
    ecoRating: null,
    priceRange: null,
    sortBy: 'newest',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false,
  },
  isLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ products: Product[]; total: number; hasMore: boolean }>
    ) => {
      state.isLoading = false
      state.items = action.payload.products
      state.pagination.total = action.payload.total
      state.pagination.hasMore = action.payload.hasMore
    },
    fetchMoreProductsSuccess: (
      state,
      action: PayloadAction<{ products: Product[]; hasMore: boolean }>
    ) => {
      state.isLoading = false
      state.items = [...state.items, ...action.payload.products]
      state.pagination.page += 1
      state.pagination.hasMore = action.payload.hasMore
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featured = action.payload
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.current = action.payload
    },
    setFilter: (
      state,
      action: PayloadAction<{
        key: keyof ProductsState['filters']
        value: any
      }>
    ) => {
      const { key, value } = action.payload
      ;(state.filters as any)[key] = value
      state.pagination.page = 1 // Reset pagination on filter change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
  },
})

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.items
export const selectFeaturedProducts = (state: { products: ProductsState }) => state.products.featured
export const selectCurrentProduct = (state: { products: ProductsState }) => state.products.current
export const selectFilters = (state: { products: ProductsState }) => state.products.filters
export const selectPagination = (state: { products: ProductsState }) => state.products.pagination
export const selectIsLoading = (state: { products: ProductsState }) => state.products.isLoading

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchMoreProductsSuccess,
  fetchProductsFailure,
  setFeaturedProducts,
  setCurrentProduct,
  setFilter,
  clearFilters,
  setPage,
} = productsSlice.actions
export default productsSlice.reducer
