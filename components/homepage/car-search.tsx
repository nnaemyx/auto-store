"use client"

import { useState, useEffect } from "react"
import { ChevronDown,  Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"
import { useManufacturers } from "@/hooks/use-manufacturers"
import { useCategories } from "@/hooks/use-categories"
import { apiClient } from "@/api/api-client"

// Type for car models
interface CarModel {
  id: number
  name: string
  manufacturer_id: string
  image: string
  description: string
}

export default function CarSearch() {
  const router = useRouter()
  const [brand, setBrand] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [part, setPart] = useState<string>("")
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isMakeOpen, setIsMakeOpen] = useState(false)
  const [isPartOpen, setIsPartOpen] = useState(false)
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Fetch manufacturers (brands)
  const { data: brands, isLoading: isLoadingBrands } = useManufacturers()

  // Fetch categories (parts)
  const { data: categories, isLoading: isLoadingCategories } = useCategories()

  // Fetch car models when brand changes
  useEffect(() => {
    const fetchCarModels = async () => {
      if (!brand) {
        setCarModels([])
        return
      }

      setIsLoadingModels(true)
      try {
        const selectedBrand = brands?.find((b) => b.name === brand)
        if (selectedBrand) {
          const response = await apiClient.get<CarModel[]>(
            `/car-model/get-car-model-by-manufacturer/${selectedBrand.id}`,
          )
          setCarModels(response || [])
        }
      } catch (error) {
        console.error("Error fetching car models:", error)
        setCarModels([])
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchCarModels()
  }, [brand, brands])

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()

    if (brand) {
      const selectedBrand = brands?.find((b) => b.name === brand)
      if (selectedBrand) params.append("manufacturer_id", selectedBrand.id.toString())
    }

    if (make) {
      const selectedModel = carModels.find((m) => m.name === make)
      if (selectedModel) params.append("car_model_id", selectedModel.id.toString())
    }

    if (part) {
      const selectedCategory = categories?.find((c) => c.name === part)
      if (selectedCategory) params.append("category_id", selectedCategory.id.toString())
    }

    // Navigate to products page with filters
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-xl md:text-lg font-medium text-center mb-8 md:mb-12">
          Shop Items Based on Your Car&apos;s Exact Specifications
        </h2>

        <div className={`${isDesktop ? "flex justify-between gap-4" : "grid grid-cols-2 gap-4"}`}>
          {/* Car Brand */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="brand" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Car Brand
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
                  <span className="text-gray-500 text-sm">{brand || "Car brand"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isBrandOpen && brands && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setBrand(b.name)
                        setIsBrandOpen(false)
                        setMake("") // Reset model when brand changes
                      }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Car Model */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="make" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Car Model
            </label>
            <div className="relative">
              <button
                id="make"
                className="w-full px-4 py-2 text-left border bg-[#00000003] border-[#0000000F] rounded-[4px] flex justify-between items-center"
                onClick={() => setIsMakeOpen(!isMakeOpen)}
                disabled={!brand || isLoadingModels}
              >
                {isLoadingModels ? (
                  <span className="flex items-center text-gray-500 text-sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading models...
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">{make || "Select model"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isMakeOpen && carModels.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {carModels.map((m) => (
                    <button
                      key={m.id}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setMake(m.name)
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
              Car Part
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
                    Loading parts...
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">{part || "Select part"}</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isPartOpen && categories && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {categories.map((p) => (
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
        <div
          onClick={handleSearch}
          className="bg-black text-white lg:w-auto w-[153px] px-6 py-3 rounded-md flex items-center"
        >
          Search
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
        </div>
        </div>
      </div>
    </div>
  )
}

