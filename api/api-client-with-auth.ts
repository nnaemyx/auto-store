// api-client-with-auth.ts
import {  fetchApi } from './api-client'

// Safely access localStorage (only in browser)
const getLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key)
}

/**
 * Enhanced API client with auth token support
 */
export const authApiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => {
    const token = getLocalStorage("token")
    const authHeaders: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` }
      : {}
      
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'GET',
      headers: {
        ...options?.headers,
        ...authHeaders
      }
    })
  },
  
  post: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => {
    const token = getLocalStorage("token")
    const authHeaders: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` }
      : {}
      
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        ...options?.headers,
        ...authHeaders
      }
    })
  },
  
  put: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => {
    const token = getLocalStorage("token")
    const authHeaders: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` }
      : {}
      
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        ...options?.headers,
        ...authHeaders
      }
    })
  },
  
  delete: <T>(endpoint: string, options?: RequestInit) => {
    const token = getLocalStorage("token")
    const authHeaders: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` }
      : {}
      
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'DELETE',
      headers: {
        ...options?.headers,
        ...authHeaders
      }
    })
  },
}