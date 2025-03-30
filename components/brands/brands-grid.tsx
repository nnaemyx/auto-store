"use client"

import Image from "next/image"
import Link from "next/link"
import { useManufacturers } from "@/hooks/use-manufacturers"
import { Loader2 } from "lucide-react"

export default function BrandsGrid() {
  const { data: brands, isLoading, isError } = useManufacturers()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      </div>
    )
  }

  // Error state
  if (isError || !brands) {
    return <div className="text-center py-8 text-gray-500">Unable to load brands. Please try again later.</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.id}`} className="flex flex-col items-center group">
          <div className="bg-gray-50 rounded-full p-4 w-[80px] h-[80px] flex items-center justify-center mb-2 transition-all group-hover:shadow-md">
            <div className="relative h-12 w-12">
              <Image
                src={
                  brand.logo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${brand.logo}`
                    : "/placeholder.svg?height=100&width=100"
                }
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <span className="text-sm text-center">{brand.name}</span>
        </Link>
      ))}
    </div>
  )
}

