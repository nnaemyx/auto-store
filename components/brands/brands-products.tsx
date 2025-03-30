"use client"

import { useManufacturer } from "@/hooks/use-manufacturers"
import { useCategories } from "@/hooks/use-categories"
import { useProducts } from "@/hooks/use-products"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BrandProductsProps {
  brandId: number
}

export default function BrandProducts({ brandId }: BrandProductsProps) {
  const { data: brand, isLoading: brandLoading, isError: brandError, error: brandErrorMsg } = useManufacturer(brandId)
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { isLoading: productsLoading } = useProducts({ manufacturer_id: brandId })

  if (brandLoading || categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </div>
    )
  }

  if (brandError || !brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Brand</h2>
          <p className="text-gray-600 mb-4">
            {brandErrorMsg instanceof Error ? brandErrorMsg.message : "Failed to load brand details"}
          </p>
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
        <Link href="/brands" className="hover:text-brand-red">
          Brands
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">{brand.name}</span>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative w-24 h-24 bg-gray-50 rounded-full overflow-hidden">
          <Image
            src={
              brand.logo ? `${process.env.NEXT_PUBLIC_API_URL}/${brand.logo}` : "/placeholder.svg?height=100&width=100"
            }
            alt={brand.name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          {brand.description && <p className="text-gray-700 mt-2">{brand.description}</p>}
        </div>
      </div>

      {/* Categories for this brand */}
      {categories && categories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products/brand/${brandId}/category/${category.id}`}
                className="flex flex-col items-center group"
              >
                <div className="bg-gray-50 rounded-full p-4 w-[80px] h-[80px] flex items-center justify-center mb-2 transition-all group-hover:shadow-md">
                  <div className="relative h-12 w-12">
                    <Image
                      src={
                        category.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${category.image}`
                          : "/placeholder.svg?height=100&width=100"
                      }
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

