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
    sub_category: string
    promotion: ProductPromotion
    images: ProductImage[]
    price: number
  }
  
  // Filter types
  export interface ProductFilters {
    category_id?: number
    manufacturer_id?: number
    price_min?: number
    price_max?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
    page?: number
    limit?: number
  }
  
  // Keep this for backward compatibility with existing components
  export interface Brand {
    name: string
    logo: string
    slug: string
    models: number
  }
  
  