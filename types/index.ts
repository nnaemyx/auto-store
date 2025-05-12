// API Response types
export interface ApiResponse<T> {
  status?: boolean
  message?: string
  data?: T
}

// Manufacturer (Brand) types
export interface Manufacturer {
  id: number
  name: string
  logo: string
  delete_status: string
  description: string
  created_at: string
  updated_at: string
}

// Category types
export interface Category {
  id: number
  name: string
  image: string
  delete_status: string
  description: string
  created_at: string
  updated_at: string
}

// Product types
export interface ProductImage {
  id: number
  product_id: string
  image: string
  created_at: string
  updated_at: string
}

export interface ProductStatus {
  id: number
  name: string
  delete_status: string
  description: string
  created_at: string
  updated_at: string
}

export interface ProductPromotion {
  id: number
  name: string
  discount: string
  status: string
  image: string
  delete_status: string
  created_at: string
  updated_at: string
}

// Add ProductType interface to existing types
export interface ProductType {
  id: number
  category_id: string
  name: string
  delete_status: string
  description: string
  created_at: string
  updated_at: string
}

// Update Product interface to include product_type
export interface Product {
  id: number
  name: string
  category_id: string
  manufacturer_id: string
  car_model_id: string
  description: string
  amount: string
  quantity: string
  rating: string
  product_status_id: string
  delete_status: string
  code: string
  promotion_id: string
  user_id: string
  created_at: string
  updated_at: string
  category: Category
  status: ProductStatus
  sub_category: Category | null
  promotion: ProductPromotion
  images: ProductImage[]
  price: number
  product_type?: ProductType
  brand?: {
    id: number
    name: string
    manufacturer_id: string
    image: string
    description: string
  }
}

// Filter types
export interface ProductFilters {
  category_id?: number
  manufacturer_id?: number
  car_model_id?: number
  price_min?: number
  price_max?: number
  product_type?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
  page?: number
  limit?: number
  search?: string
}

// Keep this for backward compatibility with existing components
export interface Brand {
  name: string
  logo: string
  slug: string
  models: number
}

export interface ProductReview {
  id: number
  product_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  likes: number
  dislikes: number
  created_at: string
  updated_at: string
}

