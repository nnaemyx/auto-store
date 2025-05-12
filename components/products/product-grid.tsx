"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useProducts } from "@/hooks/use-products"
import { useProductTypes } from "@/hooks/use-product-types"
import type { ProductFilters } from "@/types"

// Filter options
const filterOptions = {
  priceRange: ["₦1,000 - ₦10,000", "₦10,000 - ₦50,000", "₦50,000 - ₦100,000", "₦100,000+"],
}

interface ProductsGridProps {
  categoryId?: number
  manufacturerId?: number
  carModelId?: number
}

export default function ProductsGrid({ categoryId, manufacturerId, carModelId }: ProductsGridProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [filters, setFilters] = useState<ProductFilters>({
    category_id: categoryId,
    manufacturer_id: manufacturerId,
    car_model_id: carModelId,
  })

  // Fetch products
  const { data: products, isLoading, isError, error } = useProducts(filters)

  const handleApplyFilter = (filterType: string, selectedValues: string[]) => {
    if (filterType === "priceRange" && selectedValues.length > 0) {
      // Parse price range from string like "₦10,000 - ₦50,000"
      const range = selectedValues[0].replace(/[₦,]/g, "").split(" - ")
      if (range.length === 2) {
        const min = parseInt(range[0].trim())
        const max = parseInt(range[1].trim())
        if (!isNaN(min) && !isNaN(max)) {
          setFilters((prev) => ({
            ...prev,
            price_min: min,
            price_max: max,
          }))
        }
      }
    } else if (filterType === "productType") {
      setFilters((prev) => ({
        ...prev,
        product_type: selectedValues.join(","),
      }))
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)

    let sort_by: string | undefined
    let sort_order: "asc" | "desc" | undefined

    switch (value) {
      case "price-low":
        sort_by = "price"
        sort_order = "asc"
        break
      case "price-high":
        sort_by = "price"
        sort_order = "desc"
        break
      case "newest":
        sort_by = "created_at"
        sort_order = "desc"
        break
      default:
        sort_by = undefined
        sort_order = undefined
    }

    setFilters((prev) => ({
      ...prev,
      sort_by,
      sort_order,
    }))
  }

  return (
    <div>
      {/* Mobile filter and sort controls */}
      <div className="flex items-center justify-end gap-3 mb-4 md:hidden px-[16px] lg:px-0">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-[4px] w-[92px] bg-[#00000008] border-none">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <MobileFilters onApplyFilter={handleApplyFilter} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <select
            className="text-sm rounded-[4px] w-[92px] bg-[#00000008] px-2 py-2"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="relevance">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Desktop layout with sidebar filters */}
      <div className="flex flex-col md:flex-row gap-8 border-t border-[#00000012]">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-[240px] pt-[28px] px-[20px] flex-shrink-0 border-r border-[#00000012]">
          <div className="sticky">
            <div className="flex items-center gap-2 py-[7px] px-3 rounded-[4px] w-[92px] bg-[#00000008]">
              <h2 className="font-medium text-[15px]">Filters</h2>
              <Filter className="size-[18px]" />
            </div>
            <DesktopFilters onApplyFilter={handleApplyFilter} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 px-[20px] pt-[28px]">
          {/* Desktop sort controls */}
          <div className="hidden md:flex justify-between items-center">
            <h2 className="text-[18px] font-medium">All Products</h2>
            <div className="flex items-center gap-2">
              <select
                className="text-sm bg-[#00000008] rounded-md px-2 w-[92px] border-none py-1"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="relevance">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-500 mb-2">Error loading products</p>
                <p className="text-sm text-gray-500">{error instanceof Error ? error.message : "Unknown error"}</p>
              </div>
            </div>
          )}

          {/* Products */}
          {!isLoading && !isError && products && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[28px] gap-4">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group ">
                  <div className="bg-white rounded-md overflow-hidden transition-all group-hover:shadow-md flex flex-col">
                    <div className="relative w-full aspect-square bg-gray-50">
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].image
                            : ""
                        }
                        alt={product.name}
                        fill
                        className="object-cover rounded-[8px]"
                      />
                      {product.promotion && product.promotion.discount !== "0" && (
                        <div className="absolute top-2 left-2 bg-white text-red-500 z-10 rounded-full px-3 py-1 text-xs">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-[450] text-[#2F2F2F] text-sm group-hover:text-brand-red">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-semibold text-[#212121] text-sm">₦{Number.parseInt(product.amount).toLocaleString()}</p>
                        {product.promotion && product.promotion.discount !== "0" && (
                          <p className="text-xs text-gray-500 line-through">
                            ₦
                            {(
                              Number.parseInt(product.amount) *
                              (1 + Number.parseInt(product.promotion.discount) / 100)
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.category && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-[4px]">{product.category.name}</span>
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
                <p className="text-sm text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile Filters Component
function MobileFilters({ onApplyFilter }: { onApplyFilter: (filterType: string, values: string[]) => void }) {
  return (
    <div className="py-2">
      {Object.entries(filterOptions).map(([category, options]) => (
        <FilterSection
          key={category}
          title={formatCategoryTitle(category)}
          options={options}
          filterType={category}
          onApplyFilter={onApplyFilter}
        />
      ))}
    </div>
  )
}

// Filter Section Component for Mobile
function FilterSection({
  title,
  options,
  filterType,
  onApplyFilter,
}: {
  title: string
  options: string[]
  filterType: string
  onApplyFilter: (filterType: string, values: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleApply = () => {
    onApplyFilter(filterType, selectedOptions)
    setIsOpen(false)
  }

  return (
    <div className="border-b">
      <button className="flex items-center justify-between w-full px-4 py-3" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium">{title}</span>
        <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`mobile-${filterType}-${index}`}
                className="mr-2"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
              />
              <label htmlFor={`mobile-${filterType}-${index}`}>{option}</label>
            </div>
          ))}
          <Button className="w-full mt-2 bg-black text-white" onClick={handleApply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to format category titles
function formatCategoryTitle(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Desktop Filters Component
function DesktopFilters({ onApplyFilter }: { onApplyFilter: (filterType: string, values: string[]) => void }) {
  const { data: productTypes = [] } = useProductTypes()
  const { data: products } = useProducts({})

  // Calculate price ranges based on available products
  const priceRanges = useMemo(() => {
    if (!products || products.length === 0) return []
    
    const prices = products.map(p => Number(p.price))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    
    // Create ranges that make sense for the data
    const ranges = []
    const step = Math.ceil((max - min) / 4) // Divide into 4 ranges
    
    for (let i = 0; i < 4; i++) {
      const rangeMin = min + (step * i)
      const rangeMax = i === 3 ? max : min + (step * (i + 1))
      ranges.push(`₦${rangeMin.toLocaleString()} - ₦${rangeMax.toLocaleString()}`)
    }
    
    return ranges
  }, [products])

  return (
    <div className="space-y-6 mt-8">
      {/* Price Range Filter */}
      <div>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left mb-2">
            <h3 className="text-sm font-medium">Price Range</h3>
            <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <FilterOptions 
              options={priceRanges} 
              filterType="priceRange" 
              onApplyFilter={onApplyFilter}
              inputType="radio"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Product Type Filter */}
      <div>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left mb-2">
            <h3 className="text-sm font-medium">Product Type</h3>
            <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <FilterOptions 
              options={productTypes} 
              filterType="productType" 
              onApplyFilter={onApplyFilter}
              inputType="checkbox"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

// Filter Options Component
function FilterOptions({
  options,
  filterType,
  onApplyFilter,
  inputType = "checkbox"
}: {
  options: string[]
  filterType: string
  onApplyFilter: (filterType: string, values: string[]) => void
  inputType?: "checkbox" | "radio"
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) => {
      if (inputType === "radio") {
        return [option]
      }
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleApply = () => {
    if (selectedOptions.length > 0) {
      onApplyFilter(filterType, selectedOptions)
    }
  }

  return (
    <>
      {options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center">
          <input
            type={inputType}
            id={`${filterType}-${optionIndex}`}
            name={filterType}
            className="mr-2"
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
          />
          <label htmlFor={`${filterType}-${optionIndex}`} className="text-sm">
            {option}
          </label>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 bg-black text-white" 
        onClick={handleApply}
        disabled={selectedOptions.length === 0}
      >
        Apply
      </Button>
    </>
  )
}

