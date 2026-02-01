"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  clearError,
} from "@/store/slices/authSlice";
import { setApiToken } from "@/lib/api/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  sustainabilityImpact: {
    carbonSaved: number;
    waterSaved: number;
    ordersCount: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transform backend user to frontend format
function transformUser(backendUser: any): User {
  return {
    id: backendUser._id || backendUser.id,
    email: backendUser.email,
    name: backendUser.firstName
      ? `${backendUser.firstName} ${backendUser.lastName || ""}`.trim()
      : backendUser.username || backendUser.email.split("@")[0],
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    sustainabilityImpact: {
      carbonSaved: backendUser.impact?.totalCarbonSaved || 0,
      waterSaved: backendUser.impact?.totalWaterSaved || 0,
      ordersCount: 0, // Would need to fetch from orders service
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, token } = useAppSelector(
    (state) => state.auth,
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setApiToken(storedToken);
          dispatch(loginSuccess({ user: userData, token: storedToken }));

          // Optionally verify token with backend
          // Could add a /api/auth/me call here to verify token validity
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setApiToken(null);
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      dispatch(loginStart());

      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          dispatch(loginFailure(data.message || "Invalid email or password"));
          return false;
        }

        const { accessToken, refreshToken, user: backendUser } = data.data;
        const transformedUser = transformUser(backendUser);

        // Store tokens and user
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(transformedUser));

        // Set token for API calls
        setApiToken(accessToken);

        dispatch(loginSuccess({ user: transformedUser, token: accessToken }));
        return true;
      } catch (error) {
        console.error("Login error:", error);
        dispatch(loginFailure("Login failed. Please try again."));
        return false;
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      dispatch(loginStart());

      try {
        // Split name into firstName and lastName
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || undefined;

        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          dispatch(loginFailure(data.message || "Registration failed"));
          return false;
        }

        const { accessToken, refreshToken, user: backendUser } = data.data;
        const transformedUser = transformUser(backendUser);

        // Store tokens and user
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(transformedUser));

        // Set token for API calls
        setApiToken(accessToken);

        dispatch(loginSuccess({ user: transformedUser, token: accessToken }));
        return true;
      } catch (error) {
        console.error("Registration error:", error);
        dispatch(loginFailure("Registration failed. Please try again."));
        return false;
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setApiToken(null);
    dispatch(logoutAction());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Don't render children until we've checked for existing session
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-mono text-foreground-muted">
          Loading...
        </div>
      </div>
    );
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
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
