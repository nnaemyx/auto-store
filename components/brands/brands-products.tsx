"use client"

import { useManufacturer } from "@/hooks/use-manufacturers"
import { useProducts } from "@/hooks/use-products"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductsGrid from "@/components/products/product-grid"

interface BrandProductsProps {
  brandId: number
}

export default function BrandProducts({ brandId }: BrandProductsProps) {
  const { data: brand, isLoading: brandLoading, isError: brandError, error: brandErrorMsg } = useManufacturer(brandId)
  const { isLoading: productsLoading } = useProducts({ manufacturer_id: brandId })

  if (brandLoading || productsLoading) {
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
              brand.logo 
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

      {/* Products for this brand */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Products</h2>
        <ProductsGrid manufacturerId={brandId} />
      </div>
    </div>
  )
}

