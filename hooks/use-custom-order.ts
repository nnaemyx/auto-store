import { useMutation } from '@tanstack/react-query';

interface CustomOrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  product_name: string;
  description: string;
  additional?: string;
}

const submitCustomOrder = async (data: CustomOrderData) => {
  const response = await fetch('https://admin.autostores.ng/api/custom-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // This will include cookies if needed
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit order');
  }

  return response.json();
};

export const useCustomOrder = () => {
  return useMutation({
    mutationFn: submitCustomOrder,
  });
}; 