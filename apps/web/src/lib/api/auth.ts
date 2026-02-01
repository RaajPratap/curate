import { authApi } from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  success: boolean
  user: {
    id: string
    email: string
    name: string
    sustainabilityImpact: {
      carbonSaved: number
      waterSaved: number
      ordersCount: number
    }
  }
  accessToken: string
  refreshToken: string
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    authApi.post<AuthResponse>('/api/auth/login', credentials),

  register: (data: RegisterData) =>
    authApi.post<AuthResponse>('/api/auth/register', data),

  refreshToken: (refreshToken: string) =>
    authApi.post<{ accessToken: string }>('/api/auth/refresh', { refreshToken }),

  getProfile: () =>
    authApi.get<{ user: AuthResponse['user'] }>('/api/auth/profile'),

  updateProfile: (data: Partial<{ name: string; email: string }>) =>
    authApi.patch<{ user: AuthResponse['user'] }>('/api/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    authApi.post('/api/auth/change-password', data),

  forgotPassword: (email: string) =>
    authApi.post('/api/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string }) =>
    authApi.post('/api/auth/reset-password', data),
}
