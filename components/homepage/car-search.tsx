"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"
import { useCategories } from "@/hooks/use-categories"
import { useManufacturers } from "@/hooks/use-manufacturers"
import { useCarModelsFromProducts } from "@/hooks/use-car-models-from-products"

export default function CarSearch() {
  const router = useRouter()
  const [brand, setBrand] = useState<string>("")
  const [brandId, setBrandId] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [makeId, setMakeId] = useState<string>("")
  const [part, setPart] = useState<string>("")
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isMakeOpen, setIsMakeOpen] = useState(false)
  const [isPartOpen, setIsPartOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Fetch car brands using useManufacturers hook
  const { data: brands, isLoading: isLoadingBrands } = useManufacturers()

  // Fetch categories (parts)
  const { data: categories, isLoading: isLoadingCategories } = useCategories()

  // Fetch car models (makes) based on selected brand
  const { data: carModels, isLoading: isLoadingCarModels } = useCarModelsFromProducts(brandId)

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()

    if (brandId) {
      params.append("manufacturer_id", brandId)
    }

    if (makeId) {
      params.append("car_model_id", makeId)
    }

    if (part) {
      const selectedCategory = categories?.find((c) => c.name === part)
      if (selectedCategory) params.append("category_id", selectedCategory.id.toString())
    }

    // Navigate to products page with filters
    router.push(`/products?${params.toString()}`)
  }

  // When rendering categories, filter to only those with products
  const categoriesWithProducts = categories?.filter((cat) => cat.name && cat.name.trim() !== "") || [];

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-xl md:text-lg font-bold text-center ">
          Which brand are you looking to get products today?
        </h2>
        <p className="mb-8 md:mb-12 text-center text-gray-500 mt-2">Let&apos;s find the right fit for your needs.</p>

        <div className={`${isDesktop ? "flex justify-between gap-4" : "grid grid-cols-2 gap-4"}`}>
          {/* Car Brand */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="brand" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Brand
            </label>
            <div className="relative">
              <button
                id="brand"
                className="w-full px-4 py-2 text-left border bg-[#00000003] border-[#0000000F] rounded-[4px] flex justify-between items-center"
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                disabled={isLoadingBrands}
              >
                {isLoadingBrands ? (
                  <span className="flex items-center text-gray-500 text-sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading brands...
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">{brand || "Select brand"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isBrandOpen && brands && brands.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setBrand(b.name)
                        setBrandId(b.id.toString())
                        setIsBrandOpen(false)
                        setMake("") // Reset make when brand changes
                        setMakeId("")
                      }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Car Make */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="make" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Make
            </label>
            <div className="relative">
              <button
                id="make"
                className="w-full px-4 py-2 text-left border bg-[#00000003] border-[#0000000F] rounded-[4px] flex justify-between items-center"
                onClick={() => setIsMakeOpen(!isMakeOpen)}
                disabled={isLoadingCarModels || !brandId}
              >
                {isLoadingCarModels ? (
                  <span className="flex items-center text-gray-500 text-sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading makes...
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">{make || "Select make"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isMakeOpen && carModels && carModels.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {carModels.map((m) => (
                    <button
                      key={m.id}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setMake(m.name)
                        setMakeId(m.id.toString())
                        setIsMakeOpen(false)
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Car Part */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="part" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Category
            </label>
            <div className="relative">
              <button
                id="part"
                className="w-full px-4 py-2 text-left border bg-[#00000003] border-[#0000000F] rounded-[4px] flex justify-between items-center"
                onClick={() => setIsPartOpen(!isPartOpen)}
                disabled={isLoadingCategories}
              >
                {isLoadingCategories ? (
                  <span className="flex items-center text-gray-500 text-sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading categories...
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">{part || "Select category"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isPartOpen && categoriesWithProducts && categoriesWithProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {categoriesWithProducts.map((p) => (
                    <button
                      key={p.id}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      onClick={() => {
                        setPart(p.name)
                        setIsPartOpen(false)
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-6 ${isDesktop ? "flex justify-center" : ""}`}>
          <Button onClick={handleSearch} className="w-[153px] md:w-auto bg-black hover:bg-gray-800 text-white px-8">
            Search <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

