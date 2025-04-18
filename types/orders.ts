export interface ProductImage {
  id: number
  product_id: string
  image: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  amount: string
  quantity: string
  price: number
  images: ProductImage[]
  category_id?: string
  manufacturer_id?: string
  car_model_id?: string
  rating?: string
  product_status_id?: string
  code?: string
  promotion_id?: string
  user_id?: string
  created_at?: string
  cart_id?: number
  subcategory_id?: string
  [key: string]: unknown
}

export interface ExtendedOrder {
  id: number;
  user_id: string;
  amount: string;
  order_code: string;
  check_out_id: string;
  status: string;
  delivery_fee: string;
  delivery_date: string;
  payment_method: string;
  currency: string;
  created_at: string;
  updated_at: string;
  orderStatus?: {
    id: number;
    name: string;
    description: string;
  };
  checkOut?: {
    id: number;
    user_id: string;
    full_name: string;
    phone_number: string;
    email: string;
    alt_phone_number?: string;
    state: string;
    address: string;
    town: string;
    postal_code: string;
  };
  timeline?: Array<{
    id: number;
    order_id: string;
    order_status_id: string;
    status: {
      id: number;
      name: string;
      description: string;
    };
  }>;
  products?: Array<{
    id: number;
    name: string;
    description: string;
    amount: number;
    quantity: string;
    price: number;
    images: Array<{ id: number; product_id: string; image: string }>;
    [key: string]: unknown;
  }>;
} 