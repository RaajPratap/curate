const API_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001',
  products: process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 'http://localhost:3002',
  orders: process.env.NEXT_PUBLIC_ORDERS_API_URL || 'http://localhost:3003',
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(service: keyof typeof API_URLS) {
    this.baseUrl = API_URLS[service]
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Service instances
export const authApi = new ApiClient('auth')
export const productsApi = new ApiClient('products')
export const ordersApi = new ApiClient('orders')

// Set token helper
export function setApiToken(token: string | null) {
  authApi.setToken(token)
  productsApi.setToken(token)
  ordersApi.setToken(token)
}
