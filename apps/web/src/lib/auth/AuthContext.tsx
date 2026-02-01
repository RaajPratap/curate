'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  clearError,
} from '@/store/slices/authSlice'

interface User {
  id: string
  email: string
  name: string
  sustainabilityImpact: {
    carbonSaved: number
    waterSaved: number
    ordersCount: number
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database (in production, this would be API calls)
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@curate.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@curate.com',
      name: 'Demo User',
      sustainabilityImpact: {
        carbonSaved: 24.5,
        waterSaved: 1250,
        ordersCount: 3,
      },
    },
  },
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { user, isLoading, error, token } = useAppSelector((state) => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          dispatch(loginSuccess({ user: userData, token: storedToken }))
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setIsInitialized(true)
    }

    initAuth()
  }, [dispatch])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      dispatch(loginStart())
      await delay(800) // Simulate network request

      const normalizedEmail = email.toLowerCase()
      const mockUser = MOCK_USERS[normalizedEmail]

      if (mockUser && mockUser.password === password) {
        const token = `mock_token_${Date.now()}`
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(mockUser.user))
        dispatch(loginSuccess({ user: mockUser.user, token }))
        return true
      }

      // Check if this is a registered user (from registration)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      if (registeredUsers[normalizedEmail]?.password === password) {
        const token = `mock_token_${Date.now()}`
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(registeredUsers[normalizedEmail].user))
        dispatch(loginSuccess({ user: registeredUsers[normalizedEmail].user, token }))
        return true
      }

      dispatch(loginFailure('Invalid email or password'))
      return false
    },
    [dispatch]
  )

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      dispatch(loginStart())
      await delay(1000) // Simulate network request

      const normalizedEmail = email.toLowerCase()

      // Check if user already exists
      if (MOCK_USERS[normalizedEmail]) {
        dispatch(loginFailure('An account with this email already exists'))
        return false
      }

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      if (registeredUsers[normalizedEmail]) {
        dispatch(loginFailure('An account with this email already exists'))
        return false
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: normalizedEmail,
        name,
        sustainabilityImpact: {
          carbonSaved: 0,
          waterSaved: 0,
          ordersCount: 0,
        },
      }

      // Store in "database"
      registeredUsers[normalizedEmail] = { password, user: newUser }
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))

      // Auto-login after registration
      const token = `mock_token_${Date.now()}`
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      dispatch(loginSuccess({ user: newUser, token }))
      return true
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(logoutAction())
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Don't render children until we've checked for existing session
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-mono text-foreground-muted">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
