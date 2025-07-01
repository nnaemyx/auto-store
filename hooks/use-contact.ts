import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';

interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  status: string;
  message: string;
}

const submitContact = async (data: ContactData) => {
  return apiClient.post<ContactResponse>('/contact-us', data);
};

export const useContact = () => {
  return useMutation({
    mutationFn: submitContact,
  });
}; 