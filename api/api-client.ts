// Base API client for making requests to your backend

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.autostoreng.com/api"

/**
 * Fetches data from the API with proper error handling
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`


  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })


  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!response.ok) {
    let error
    try {
      error = await response.json()
      console.error('API Error response:', error);
    } catch {
      error = {
        message: `An error occurred while fetching data: ${response.statusText}`,
      }
      console.error('API Error (non-JSON):', error);
    }
    throw new Error(error.message || "An error occurred while fetching data")
  }

  const data = await response.json();
  console.log('API Response data:', data);
  return data;
}

/**
 * API client with methods for common operations
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T, TData = unknown>(endpoint: string, data: TData, options?: RequestInit) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

