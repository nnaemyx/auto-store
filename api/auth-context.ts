import { createContext, useContext } from "react"

// User type
export type User = {
  id: number
  username: string
  email: string
  phone_number: string
  image: string
  role_id: string
}

// Registration data type
export type RegisterData = {
  username: string
  email: string
  password: string
  phone_number: string
  confirm_password: string
}

// Auth response type from API
export type AuthResponse = {
  status: string
  message?: string
  access_token?: string
  user?: User[]
}

// Auth context type with added API methods
export type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  // Add authenticated API methods
  api: {
    get: <T>(endpoint: string, options?: RequestInit) => Promise<T>
    post: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => Promise<T>
    put: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => Promise<T>
    delete: <T>(endpoint: string, options?: RequestInit) => Promise<T>
  }
  // Example specific API methods
  fetchUserProfile: () => Promise<User>
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  api: {
    get: async () => { throw new Error("Not implemented") },
    post: async () => { throw new Error("Not implemented") },
    put: async () => { throw new Error("Not implemented") },
    delete: async () => { throw new Error("Not implemented") }
  },
  fetchUserProfile: async () => { throw new Error("Not implemented") }
})

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext)