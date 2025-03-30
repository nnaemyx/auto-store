"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthContext, type User, type RegisterData, type AuthResponse } from "./auth-context"
import { apiClient } from "./api-client"
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
  const { toast, ToastVariant } = useToast();

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

  // Login mutation
// Login mutation
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
      // Check if the status is "successful" (string) instead of true (boolean)
      toast({
        title: "Success",
        description: "Login successful!",
        variant: ToastVariant.Success,
      });
      if (response.status === "successful" && response.user) {
        // Generate a temporary token since the API doesn't provide one
        const tempToken = `temp_token_${Date.now()}`
        setLocalStorage("token", tempToken)
        
        // Use the first user in the array (you might want to handle this differently)
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
      throw error
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      return apiClient.post<AuthResponse>("/auth/register-user", userData)
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (response) => {
      if (response.status === "successful" && response.user) {  
        const tempToken = `temp_token_${Date.now()}`
        setLocalStorage("token", tempToken)
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
      throw error
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

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

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

