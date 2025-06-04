import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';

interface CustomOrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  product_name: string;
  description: string;
  additional?: string;
}

interface CustomOrderResponse {
  status: string;
  message: string;
}

const submitCustomOrder = async (data: CustomOrderData) => {
  return apiClient.post<CustomOrderResponse>('/custom-order', data);
};

export const useCustomOrder = () => {
  return useMutation({
    mutationFn: submitCustomOrder,
  });
}; 