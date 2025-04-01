"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, ShoppingCart, Star, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProduct, useProductsByCategory } from "@/hooks/use-products"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailsProps {
  id: number
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
const {toast} = useToast()
  // Fetch product data using TanStack Query
  const { data: product, isLoading, isError, error } = useProduct(id)

  // Use the cart hook
  const { addToCart, isAddingToCart } = useCart()

  // Set main image when product data loads
  useEffect(() => {
    if (product && product.images && product.images.length > 0 && !mainImage) {
      setMainImage(product.images[0].image)
    }
  }, [product, mainImage])

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart({ productId: product.id, quantity })
  }

  const handleBuyNow = () => {
    if (!product) return

    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          // Navigate to checkout
          window.location.href = "/checkout"
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process purchase",
          })
        },
      },
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-red" />
      </div>
    )
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load product details"}
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red">
          Home
        </Link>
        {" / "}
        <Link href="/products" className="hover:text-brand-red">
          Products
        </Link>
        {" / "}
        {product.category && (
          <>
            <Link href={`/category/${product.category.id}`} className="hover:text-brand-red">
              {product.category.name}
            </Link>
            {" / "}
          </>
        )}
        <span className="font-medium text-gray-700">{product.name}</span>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-[300px] md:h-[400px] bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={
                mainImage ||
                (product.images && product.images.length > 0
                  ? product.images[0].image
                  : "")
              }
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {product.images &&
              product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-[80px] h-[80px] flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer hover:border-brand-red"
                  onClick={() => setMainImage(image.image)}
                >
                  <Image
                    src={image.image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xl md:text-2xl font-bold">₦{Number.parseInt(product.amount).toLocaleString()}</p>
              {product.promotion && product.promotion.discount !== "0" && (
                <p className="text-sm text-gray-500 line-through">
                  ₦
                  {(
                    Number.parseInt(product.amount) *
                    (1 + Number.parseInt(product.promotion.discount) / 100)
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Number.parseInt(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating} rating)</span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Size Selection */}
          <div className="space-y-2">
            <label htmlFor="size" className="block text-sm font-medium">
              Select size
            </label>
            <select
              id="size"
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label htmlFor="color" className="block text-sm font-medium">
              Colour
            </label>
            <select
              id="color"
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Select colour</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Quantity</label>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 min-w-[40px] text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {Number.parseInt(product.quantity) > 0 ? (
              <span className="text-green-600">In Stock ({product.quantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1"
              onClick={handleBuyNow}
              disabled={isAddingToCart || Number.parseInt(product.quantity) <= 0}
            >
              {isAddingToCart ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart || Number.parseInt(product.quantity) <= 0}
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* SKU and Brand */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>SKU: {product.code}</p>
            {product.manufacturer_id && (
              <p>
                Brand:{" "}
                <Link href={`/brand/${product.manufacturer_id}`} className="hover:text-brand-red">
                  {/* Replace with actual manufacturer name if available */}
                  Manufacturer #{product.manufacturer_id}
                </Link>
              </p>
            )}
            {product.category && (
              <p>
                Category:{" "}
                <Link href={`/category/${product.category_id}`} className="hover:text-brand-red">
                  {product.category.name}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <div className="space-y-4 text-gray-700">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* {product.specifications &&
            Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b">
                <span className="font-medium capitalize">{key}</span>
                <span>{value}</span>
              </div>
            ))} */}
        </div>
      </div>

      {/* Product Rating Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          {/* Product rating ({product.rating} from {product.review_count} ratings) */}
        </h2>
        <ProductReviews productId={id} />
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <RelatedProducts categoryId={Number(product.category_id)} currentProductId={product.id} />
      </div>
    </div>
  )
}

// Product Reviews Component
function ProductReviews({  }: { productId: number }) {
  // In a real app, you would fetch reviews from an API
  // For now, we'll use mock data
  const reviews = [
    {
      id: 1,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 3,
      dislikes: 0,
    },
    {
      id: 2,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 1,
      dislikes: 0,
    },
    {
      id: 3,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 5,
      dislikes: 1,
    },
  ]

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.avatar} alt={review.user} />
              <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-medium">{review.user}</h4>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex mt-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm">{review.content}</p>
              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{review.dislikes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Related Products Component
function RelatedProducts({ categoryId, currentProductId }: { categoryId: number; currentProductId: number }) {
  const { data: products, isLoading, isError } = useProductsByCategory(categoryId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-brand-red" />
      </div>
    )
  }

  if (isError || !products) {
    return null
  }

  // Filter out the current product and limit to 4 items
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {relatedProducts.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`} className="group">
          <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
            <div className="relative h-32 md:h-40 bg-gray-50">
              <Image
                src={product.images[0]?.image  }
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm group-hover:text-brand-red">{product.name}</h3>
              <p className="font-bold text-sm">₦{product.price.toLocaleString()}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {/* {product.tags &&
                  product.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))} */}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

