"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthContext, type User, type RegisterData, type AuthResponse } from "./auth-context"
import { apiClient } from "./api-client"
import { authApiClient } from "./api-client-with-auth" // Import the auth API client
import { useToast } from "@/hooks/use-toast"

// Safely access localStorage (only in browser)
const getLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key)
}

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, value)
}

const removeLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(key)
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast, ToastVariant } = useToast()

  // Initialize user from localStorage only on the client side
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getLocalStorage("token")
        if (token) {
          const userDataString = getLocalStorage("user")
          if (userDataString) {
            const userData = JSON.parse(userDataString)
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error)
        removeLocalStorage("token")
        removeLocalStorage("user")
      }
    }

    initializeAuth()
  }, [])

  // Login mutation - use regular apiClient for authentication
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("Sending login request with:", { email })
      const response = await apiClient.post<AuthResponse>("/auth/login-user", { email, password })
      console.log("Raw API response:", response)
      return response
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Login successful!",
        variant: ToastVariant.Success,
      })

      if (response.status === "successful" && response.user && response.access_token) {
        // Store the actual access token from the API response
        const token = response.access_token
        setLocalStorage("token", token)

        // Use the first user in the array
        const userData = response.user[0]
        setLocalStorage("user", JSON.stringify(userData))
        setUser(userData)
        
        router.push("/")
      } else {
        throw new Error(response.message || "Login failed")
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: ToastVariant.Error,
      })
      throw error
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  // Register mutation - use regular apiClient for registration
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      return apiClient.post<AuthResponse>("/auth/register-user", userData)
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Registration successful!",
        variant: ToastVariant.Success,
      })

      if (response.status === "successful" && response.user && response.access_token) {
        // Store the actual access token from the API response
        const token = response.access_token
        setLocalStorage("token", token)
        
        const userData = response.user[0]
        setLocalStorage("user", JSON.stringify(userData))
        setUser(userData)
        
        router.push("/")
      } else {
        throw new Error(response.message || "Registration failed")
      }
    },
    onError: (error) => {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: ToastVariant.Error,
      })
      throw error
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  // Example of a protected API call using authApiClient
  const fetchUserProfile = async () => {
    try {
      // This will automatically include the auth token
      const userData = await authApiClient.get<User>("/user/profile")
      return userData
    } catch (error) {
      console.error("Error fetching user profile:", error)
      if (error instanceof Error && error.message.includes("Authentication required")) {
        // Handle authentication errors
        logout()
      }
      throw error
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    await loginMutation.mutateAsync({ email, password })
  }

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    await registerMutation.mutateAsync(userData)
  }

  // Logout function
  const logout = () => {
    removeLocalStorage("token")
    removeLocalStorage("user")
    setUser(null)
    // Invalidate and reset any queries that depend on authentication
    queryClient.clear()
    router.push("/auth/login")
  }

  // Enhanced context value with authApiClient methods
  const authContext = {
    user,
    isLoading,
    login,
    register,
    logout,
    // Include authenticated API methods
    api: {
      get: authApiClient.get,
      post: authApiClient.post,
      put: authApiClient.put,
      delete: authApiClient.delete
    },
    // Example specific API methods
    fetchUserProfile
  }

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
}