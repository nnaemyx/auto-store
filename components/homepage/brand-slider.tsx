"use client"

import Image from "next/image"
import Link from "next/link"
import { useManufacturers } from "@/hooks/use-manufacturers"
import { Loader2 } from "lucide-react"

const BrandSlider = () => {
  const { data: brands, isLoading, isError } = useManufacturers()
console.log(brands)
  // Loading state
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Shop by Brands</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !brands) {
    return (
      <div>
        <h2 className="text-[20px] md:text-[18px] tracking-[-4%] text-center lg:text-left font-medium ">Shop by Brands</h2>
        <div className="text-center py-8 text-gray-500">Unable to load brands. Please try again later.</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-[20px] md:text-[18px] tracking-[-4%] text-center lg:text-left font-medium  mb-6">Shop by Brands</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.id}`} className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-full p-4 w-[80px] h-[80px] flex items-center justify-center mb-2">
              <div className="relative h-12 w-12">
                <Image
                  src={brand.logo}
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
    </div>
  )
}

export default BrandSlider

