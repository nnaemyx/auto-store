"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProduct} from "@/hooks/use-products"
// import { toast } from "sonner"

interface ProductDetailsProps {
  id: number
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  // Fetch product data using TanStack Query
  const { data: product, isLoading, isError, error } = useProduct(id)

  // Add to cart mutation
//   const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()

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

//   const handleAddToCart = () => {
//     if (!product) return

//     addToCart(
//       { id: product.id, quantity },
//       {
//         onSuccess: () => {
//           toast( `${product.name} has been added to your cart`)
//         },
//         onError: () => {
//           toast("Failed to add to cart")
//         },
//       },
//     )
//   }

//   const handleBuyNow = () => {
//     if (!product) return

//     addToCart(
//       { id: product.id, quantity },
//       {
//         onSuccess: () => {
//           // Navigate to checkout
//           window.location.href = "/checkout"
//         },
//         onError: (error) => {
//           toast({
//             title: "Error",
//             description: error instanceof Error ? error.message : "Failed to process purchase",
//             variant: "destructive",
//           })
//         },
//       },
//     )
//   }

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
                  : "/placeholder.svg?height=400&width=400")
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
                    src={image.image || "/placeholder.svg?height=80&width=80"}
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
            //   disabled={isAddingToCart || Number.parseInt(product.quantity) <= 0}
            >
              {/* {isAddingToCart ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} */}
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            //   disabled={isAddingToCart || Number.parseInt(product.quantity) <= 0}
            >
              {/* {isAddingToCart ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )} */}
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
                  {/* Replace 'Manufacturer Name' with actual logic to fetch the name */}
                  Manufacturer Name
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
          {/* Specifications data is not available in the Product type */}
          <p className="text-gray-500">Specifications are not available for this product.</p>
        </div>
      </div>

      {/* Product Rating Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Product rating ({product.rating})
        </h2>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
      </div>
    </div>
  )
}


