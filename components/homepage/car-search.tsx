"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const carBrands = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Volkswagen", "Audi", "Nissan", "Mazda"]
const carMakes = ["Camry", "Corolla", "Civic", "Accord", "C-Class", "E-Class", "3 Series", "5 Series", "RX", "ES"]
const carParts = [
  "Engine Parts",
  "Brakes",
  "Suspension",
  "Transmission",
  "Electrical",
  "Body Parts",
  "Interior",
  "Exterior",
  "Cooling System",
  "Filters",
]

export default function CarSearch() {
  const [brand, setBrand] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [part, setPart] = useState<string>("")
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isMakeOpen, setIsMakeOpen] = useState(false)
  const [isPartOpen, setIsPartOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleSearch = () => {
    console.log({ brand, make, part })
    // Implement search functionality
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
              >
                <span className="text-gray-500 text-sm">{brand || "Car brand"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isBrandOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {carBrands.map((b) => (
                    <button
                      key={b}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setBrand(b)
                        setIsBrandOpen(false)
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Car Make */}
          <div className="relative mb-4 md:mb-0 md:flex-1">
            <label htmlFor="make" className="block font-[450] mb-2 text-[14px] md:text-[16px]">
              Car Model
            </label>
            <div className="relative">
              <button
                id="make"
                className="w-full px-4 py-2 text-left border  bg-[#00000003] border-[#0000000F] rounded-[4px] flex justify-between items-center"
                onClick={() => setIsMakeOpen(!isMakeOpen)}
              >
                <span className="text-gray-500 text-sm">{make || "Town or city"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isMakeOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {carMakes.map((m) => (
                    <button
                      key={m}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setMake(m)
                        setIsMakeOpen(false)
                      }}
                    >
                      {m}
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
              >
                <span className="text-gray-500 text-sm">{part || "Town or city"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isPartOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {carParts.map((p) => (
                    <button
                      key={p}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      onClick={() => {
                        setPart(p)
                        setIsPartOpen(false)
                      }}
                    >
                      {p}
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

