"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Loader2,
  ChevronRight,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProduct, useProductsByCategory } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useProductReviews } from "@/hooks/use-product-reviews";

interface ProductDetailsProps {
  id: number;
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  // Fetch product data using TanStack Query
  const { data: product, isLoading, isError, error } = useProduct(id);

  // Fetch product reviews
  const { data: reviewsData } = useProductReviews(
    product?.id?.toString() || null
  );

  // Use the cart hook
  const { addToCart, isAddingToCart } = useCart();

  // Set main image when product data loads
  useEffect(() => {
    if (product && product.images && product.images.length > 0 && !mainImage) {
      setMainImage(product.images[0].image);
    }
  }, [product, mainImage]);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    if (!product) return;

    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          // Navigate to checkout
          window.location.href = "/checkout";
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to process purchase",
          });
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-red" />
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load product details"}
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:container mx-auto lg:p-10 ">
      {/* Product Details Section */}
      <div className="flex lg:flex-row flex-col gap-10 mb-8">
        {/* Product Images */}
        <div className="space-y-4 max-w-[840px] w-full">
          <div className="relative h-[300px] md:h-[640px] bg-gray-50 rounded-lg overflow-hidden">
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
                  className="relative w-[210px] h-[160px] flex-shrink-0 rounded-md overflow-hidden cursor-pointer "
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
        <div className="space-y-6 lg:max-w-[400px] px-[16px] w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xl md:text-2xl font-bold">
                ₦{Number.parseInt(product.amount).toLocaleString()}
              </p>
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
                    i < (reviewsData?.averageRating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviewsData?.averageRating?.toFixed(1) || 0} rating)
            </span>
            {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
              <span className="text-sm text-gray-500">
                • {reviewsData.reviews.length} reviews
              </span>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Quantity</label>
            <div className="flex flex-row items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="py-[9px] lg:w-9 bg-[#00000008] border-none rounded-[4px]"
              >
                <Minus className="size-[18px]" />
              </Button>
              <span className=" lg:min-w-[296px] w-full text-center rounded-[4px] bg-[#00000008] py-[7px]">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="py-[9px] w-9 bg-black text-white rounded-[4px]"
              >
                <Plus className="size-[18px]" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {Number.parseInt(product.quantity) > 0 ? (
              <span className="text-green-600">
                In Stock ({product.quantity} available)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-row gap-4">
            <Button
              className="flex-1 bg-black text-white rounded-[4px]"
              onClick={handleBuyNow}
              disabled={
                isAddingToCart || Number.parseInt(product.quantity) <= 0
              }
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-[#00000008] border-none rounded-[4px]"
              onClick={handleAddToCart}
              disabled={
                isAddingToCart || Number.parseInt(product.quantity) <= 0
              }
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col px-[16px] lg:px-0 gap-10">
        <div className="max-w-[840px] w-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="space-y-4 text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>
          {/* Reviews Section */}
          <div className="bg-white rounded-lg mb-8">
            <div className="mb-6">
              <h3 className="text-[15px] font-medium mb-1">
                Product rating ({reviewsData?.averageRating?.toFixed(1) || 0} from {reviewsData?.reviews?.length || 0} ratings)
              </h3>
            </div>

            <div className="space-y-6">
              {reviewsData?.reviews?.map((review, index) => (
                <div key={index} className="pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.user?.image || `https://ui-avatars.com/api/?name=${review.user?.username || 'User'}`}
                        alt={review.user?.username || 'User'}
                      />
                      <AvatarFallback>{review.user?.username?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-sm font-medium">{review.user?.username || 'Anonymous User'}</p>

                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {review.comment}
                      </p>
                      {/* <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-gray-500">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs">{review.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500">
                          <ThumbsDown className="h-4 w-4" />
                          <span className="text-xs">{review.dislikes || 0}</span>
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
              {(!reviewsData?.reviews || reviewsData.reviews.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
        {/* Specifications Section */}
        <div className="bg-white rounded-lg p-4 max-w-[400px] w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-medium">Specifications</h2>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-gray-500 text-sm">Weight</p>
              <p className="text-sm">12.5 KG</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Dimensions</p>
              <p className="text-sm">234 by 128 cm</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Colour</p>
              <p className="text-sm">Black, Red, Green, Blue</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Condition</p>
              <p className="text-sm">New</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Est. delivery date</p>
                <p className="text-sm">05/01/2025</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Status</p>
                <p className="text-yellow-500 text-sm">Order shipped</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12 px-[16px] lg:px-0">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <RelatedProducts
          categoryId={Number(product.category_id)}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}

// Related Products Component
function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: number;
  currentProductId: number;
}) {
  const {
    data: products,
    isLoading,
    isError,
  } = useProductsByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-brand-red" />
      </div>
    );
  }

  if (isError || !products) {
    return null;
  }

  // Filter out the current product and limit to 4 items
  const relatedProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {relatedProducts.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="group"
        >
          <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
            <div className="relative h-32 md:h-40 bg-gray-50">
              <Image
                src={product.images[0]?.image}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm group-hover:text-brand-red">
                {product.name}
              </h3>
              <p className="font-bold text-sm">
                ₦{product.price.toLocaleString()}
              </p>
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
  );
}
