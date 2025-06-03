"use client";
// components/BestSellingItems.tsx

import Image from "next/image";
import Link from "next/link";

import { useProducts } from "@/hooks/use-products";

export default function BestSellingItems() {
  const { data: products, isLoading, isError } = useProducts();
  return (
    <div className="">
      <h2 className="text-[20px] md:text-[18px] tracking-[-4%] text-center lg:text-left font-medium mb-10">
        Best Selling Items
      </h2>

      {/* Desktop Layout - Grid with 4 columns */}
      <div className="">
        {!isLoading && !isError && products && (
          <div className="hidden lg:grid lg:grid-cols-3 md:gap-6">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md flex flex-col">
                  <div className="relative w-full aspect-square bg-gray-50">
                    <Image
                      src={product.images[0]?.image || ""}
                      alt={product.name}
                      fill
                      className="object-cover rounded-[8px]"
                    />
                    {product.promotion &&
                      product.promotion.discount !== "0" && (
                        <div className="absolute top-2 left-2 bg-brand-red text-white rounded-full px-3 py-1 text-xs">
                          Sale
                        </div>
                      )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm group-hover:text-brand-red">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-semibold text-sm">
                        ₦{Number.parseInt(product.amount).toLocaleString()}
                      </p>
                      {product.promotion &&
                        product.promotion.discount !== "0" && (
                          <p className="text-xs text-gray-500 line-through">
                            ₦
                            {(
                              Number.parseInt(product.amount) *
                              (1 +
                                Number.parseInt(product.promotion.discount) /
                                  100)
                            ).toLocaleString()}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.category && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-[4px]">
                          {product.category.name}
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-[4px]">
                        {product.status ? product.status.name : "In Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No products found */}
        {!isLoading && !isError && products && products.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout - 2 columns per row */}
      <div className="">
        {!isLoading && !isError && products && (
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
                  <div className="relative h-40 md:h-48 bg-gray-50">
                    <Image
                      src={product.images[0]?.image || "/placeholder-image.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                    {product.promotion &&
                      product.promotion.discount !== "0" && (
                        <div className="absolute top-2 left-2 bg-brand-red text-white rounded-full px-3 py-1 text-xs">
                          Sale
                        </div>
                      )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm group-hover:text-brand-red">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-bold text-sm">
                        ₦{Number.parseInt(product.amount).toLocaleString()}
                      </p>
                      {product.promotion &&
                        product.promotion.discount !== "0" && (
                          <p className="text-xs text-gray-500 line-through">
                            ₦
                            {(
                              Number.parseInt(product.amount) *
                              (1 +
                                Number.parseInt(product.promotion.discount) /
                                  100)
                            ).toLocaleString()}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.category && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {product.category.name}
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {product.status ? product.status.name : "In Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No products found */}
        {!isLoading && !isError && products && products.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        )}
      </div>

      {/* See more button */}
      <div className="flex justify-center mt-8 px-4">
        <Link
          href="/product"
          className="bg-black text-white text-center mx-auto justify-center lg:w-auto px-6 py-3 w-full rounded-md flex items-center"
        >
          See more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
