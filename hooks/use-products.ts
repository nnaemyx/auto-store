"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/api-client"
import type { Product, ProductFilters } from "@/types"

// Query keys for caching and invalidation
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters = {}) => [...productKeys.lists(), { ...filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byCategory: (categoryId: number) => [...productKeys.lists(), { category: categoryId }] as const,
  byManufacturer: (manufacturerId: number) => [...productKeys.lists(), { manufacturer: manufacturerId }] as const,
}

// Get all products with optional filters
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  })
}

// Get a single product by ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id, // Only run the query if we have an ID
  })
}

// Get products by category ID
export function useProductsByCategory(categoryId: number) {
  console.log("useProductsByCategory called with ID:", categoryId);
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: () => {
      console.log("useProductsByCategory queryFn executing");
      return fetchProductsByCategory(categoryId);
    },
    enabled: !!categoryId, // Only run the query if we have a category ID
  })
}

// Get products by manufacturer ID
export function useProductsByManufacturer(manufacturerId: number) {
  return useQuery({
    queryKey: productKeys.byManufacturer(manufacturerId),
    queryFn: () => fetchProductsByManufacturer(manufacturerId),
    enabled: !!manufacturerId, // Only run the query if we have a manufacturer ID
  })
}

// Add a product to cart
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // This is a placeholder for a real cart API endpoint
      // In a real app, you would call your cart API
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

// Helper function to get the full image URL
function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=200&width=200"

  // If it's already a full URL, return it
  if (imagePath.startsWith("http")) return imagePath

  // Otherwise, prepend the API base URL
  return `${process.env.NEXT_PUBLIC_API_URL}/${imagePath}`
}

// API functions
async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const response = await apiClient.get<Product[]>("/product/all")

  let filteredProducts = response

  // Apply filters on the client side if needed
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter((p) => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.name.toLowerCase().includes(searchTerm) ||
      (p.brand?.name.toLowerCase().includes(searchTerm))
    )
  }

  if (filters.category_id) {
    filteredProducts = filteredProducts.filter((p) => Number.parseInt(p.category_id) === filters.category_id)
  }

  if (filters.manufacturer_id) {
    filteredProducts = filteredProducts.filter((p) => Number.parseInt(p.manufacturer_id) === filters.manufacturer_id)
  }

  if (filters.price_min !== undefined) {
    filteredProducts = filteredProducts.filter((p) => Number.parseFloat(p.amount) >= filters.price_min!)
  }

  if (filters.price_max !== undefined) {
    filteredProducts = filteredProducts.filter((p) => Number.parseFloat(p.amount) <= filters.price_max!)
  }

  // Sort products
  if (filters.sort_by) {
    const sortOrder = filters.sort_order === "desc" ? -1 : 1

    filteredProducts.sort((a, b) => {
      if (filters.sort_by === "price") {
        return sortOrder * (Number.parseFloat(a.amount) - Number.parseFloat(b.amount))
      }
      if (filters.sort_by === "name") {
        return sortOrder * a.name.localeCompare(b.name)
      }
      return 0
    })
  }

  // Process images to get full URLs
  return filteredProducts.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      image: getImageUrl(img.image),
    })),
  }))
}

async function fetchProductById(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/product/get-product/${id}`)

  // Process images to get full URLs
  return {
    ...response,
    images: response.images.map((img) => ({
      ...img,
      image: getImageUrl(img.image),
    })),
  }
}

async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    console.log("fetchProductsByCategory executing with ID:", categoryId);
    
    // First get all products
    const allProducts = await apiClient.get<Product[]>("/product/all")
    console.log("Total products fetched:", allProducts.length);
    
    // Get the category name from the first product that matches the categoryId
    const categoryProduct = allProducts.find(
      (product) => Number.parseInt(product.category_id) === categoryId
    )
    console.log("Found category product:", categoryProduct);
    
    if (!categoryProduct?.category?.name) {
      console.error("Category not found for ID:", categoryId)
      return []
    }

    const categoryName = categoryProduct.category.name
    console.log("Using category name:", categoryName);
    
    // Filter by category name and check product_status_id
    const filteredProducts = allProducts.filter(
      (product) => 
        product.category?.name === categoryName && 
        product.product_status_id === "1" // 1 means in stock/active
    )
    console.log("Filtered products count:", filteredProducts.length);
    console.log("Filtered products:", filteredProducts);

    // Process images to get full URLs
    const processedProducts = filteredProducts.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        image: getImageUrl(img.image),
      })),
    }))
    console.log("Final processed products:", processedProducts);

    return processedProducts;
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

async function fetchProductsByManufacturer(manufacturerId: number): Promise<Product[]> {
  const response = await apiClient.get<Product[]>(`/product/get-product-by-manufacturer/${manufacturerId}`)

  // Filter out deleted products (delete_status = "1")
  const filteredProducts = response.filter((product) => product.delete_status === "2")

  // Process images to get full URLs
  return filteredProducts.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      image: getImageUrl(img.image),
    })),
  }))
}

