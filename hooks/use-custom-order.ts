import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';

interface CustomOrderData {
  name: string;
  email: string;
  phone: string;
  product_name: string;
  description: string;
  address?: string;
  additional?: string;
  images?: FileList;
}

interface CustomOrderResponse {
  status: string;
  message: string;
}

const submitCustomOrder = async (data: CustomOrderData) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // If there are images, use FormData, otherwise use JSON
  if (data.images && data.images.length > 0) {
    const formData = new FormData();
    
    // Add all the text fields
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('product_name', data.product_name);
    formData.append('description', data.description);
    if (data.address) formData.append('address', data.address);
    if (data.additional) formData.append('additional', data.additional);
    
    // Add images
    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    });

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Use direct fetch for FormData
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.autostoreng.com/api";
    const url = `${API_BASE_URL}/custom-order`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        ...headers,
      },
      body: formData,
    });

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
        console.error('Custom Order API Error response:', error);
      } catch {
        error = {
          message: `An error occurred while submitting custom order: ${response.statusText}`,
        };
        console.error('Custom Order API Error (non-JSON):', error);
      }
      throw new Error(error.message || "An error occurred while submitting custom order");
    }

    return await response.json();
  } else {
    // Use JSON for text-only submissions
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiClient.post<CustomOrderResponse>('/custom-order', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      product_name: data.product_name,
      description: data.description,
      address: data.address,
      additional: data.additional,
    }, {
      headers
    });
  }
};

export const useCustomOrder = () => {
  return useMutation({
    mutationFn: submitCustomOrder,
  });
}; 