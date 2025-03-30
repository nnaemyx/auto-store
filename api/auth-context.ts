"use client"

import { createContext } from "react"

// Types
export interface User {
  id: string
  email: string
  username: string
  phone_number: string;
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  phone_number: string
  username: string
  password: string
  confirm_password: string
}

export type AuthResponse = {
    status: string;
    user: User[];
    message?: string;
  };

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

