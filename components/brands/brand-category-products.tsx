"use client"

import type React from "react"

import { useState } from "react"
import { useManufacturer } from "@/hooks/use-manufacturers"
import { useCategory } from "@/hooks/use-categories"
import { useProductsByBrandCategory } from "@/hooks/use-products-by-brand-category"
import { Loader2, ChevronDown, ChevronUp, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BrandCategoryProductsProps {
  brandId: number
  categoryId: number
}

export default function BrandCategoryProducts({ brandId, categoryId }: BrandCategoryProductsProps) {
  const { data: brand, isLoading: brandLoading, isError: brandError } = useManufacturer(brandId)
  const { data: category, isLoading: categoryLoading, isError: categoryError } = useCategory(categoryId)
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMsg,
  } = useProductsByBrandCategory(brandId, categoryId)

  const [sortBy, setSortBy] = useState("relevance")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    "priceRange",
    "location",
    "vehicleMake",
    "engineType",
  ])

  const toggleFilter = (filterType: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterType) ? prev.filter((f) => f !== filterType) : [...prev, filterType],
    )
  }

  const isFilterExpanded = (filterType: string) => expandedFilters.includes(filterType)

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const currentValues = prev[filterType] || []
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      }
    })
  }

  const isFilterActive = (filterType: string, value: string) => {
    return (activeFilters[filterType] || []).includes(value)
  }

  const applyFilters = () => {
    // In a real app, this would update the query parameters and refetch products
    console.log("Applied filters:", activeFilters)
  }

  if (brandLoading || categoryLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </div>
    )
  }

  if (brandError || categoryError || productsError || !brand || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">
            {productsErrorMsg instanceof Error ? productsErrorMsg.message : "Failed to load products"}
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
          Car Brands
        </Link>
        {" / "}
        <Link href={`/brands/${brandId}`} className="hover:text-brand-red">
          {brand.name}
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">{category.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <h2 className="font-medium">Filters</h2>
            </div>

            {/* Price Range Filter */}
            <FilterSection
              title="Price Range"
              expanded={isFilterExpanded("priceRange")}
              onToggle={() => toggleFilter("priceRange")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="price-1"
                  label="₦1,000 - ₦10,000"
                  checked={isFilterActive("priceRange", "1000-10000")}
                  onChange={() => handleFilterChange("priceRange", "1000-10000")}
                />
                <FilterCheckbox
                  id="price-2"
                  label="₦10,000 - ₦50,000"
                  checked={isFilterActive("priceRange", "10000-50000")}
                  onChange={() => handleFilterChange("priceRange", "10000-50000")}
                />
                <FilterCheckbox
                  id="price-3"
                  label="₦50,000 - ₦100,000"
                  checked={isFilterActive("priceRange", "50000-100000")}
                  onChange={() => handleFilterChange("priceRange", "50000-100000")}
                />
                <FilterCheckbox
                  id="price-4"
                  label="₦100,000+"
                  checked={isFilterActive("priceRange", "100000+")}
                  onChange={() => handleFilterChange("priceRange", "100000+")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection
              title="Location"
              expanded={isFilterExpanded("location")}
              onToggle={() => toggleFilter("location")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="location-1"
                  label="Lagos"
                  checked={isFilterActive("location", "lagos")}
                  onChange={() => handleFilterChange("location", "lagos")}
                />
                <FilterCheckbox
                  id="location-2"
                  label="Abuja"
                  checked={isFilterActive("location", "abuja")}
                  onChange={() => handleFilterChange("location", "abuja")}
                />
                <FilterCheckbox
                  id="location-3"
                  label="Port Harcourt"
                  checked={isFilterActive("location", "port-harcourt")}
                  onChange={() => handleFilterChange("location", "port-harcourt")}
                />
                <FilterCheckbox
                  id="location-4"
                  label="Kano"
                  checked={isFilterActive("location", "kano")}
                  onChange={() => handleFilterChange("location", "kano")}
                />
                <FilterCheckbox
                  id="location-5"
                  label="Other states"
                  checked={isFilterActive("location", "other")}
                  onChange={() => handleFilterChange("location", "other")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Vehicle Make Filter */}
            <FilterSection
              title="Vehicle make"
              expanded={isFilterExpanded("vehicleMake")}
              onToggle={() => toggleFilter("vehicleMake")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="make-1"
                  label="Toyota"
                  checked={isFilterActive("vehicleMake", "toyota")}
                  onChange={() => handleFilterChange("vehicleMake", "toyota")}
                />
                <FilterCheckbox
                  id="make-2"
                  label="Honda"
                  checked={isFilterActive("vehicleMake", "honda")}
                  onChange={() => handleFilterChange("vehicleMake", "honda")}
                />
                <FilterCheckbox
                  id="make-3"
                  label="Lexus"
                  checked={isFilterActive("vehicleMake", "lexus")}
                  onChange={() => handleFilterChange("vehicleMake", "lexus")}
                />
                <FilterCheckbox
                  id="make-4"
                  label="Nissan"
                  checked={isFilterActive("vehicleMake", "nissan")}
                  onChange={() => handleFilterChange("vehicleMake", "nissan")}
                />
                <FilterCheckbox
                  id="make-5"
                  label="Peugeot"
                  checked={isFilterActive("vehicleMake", "peugeot")}
                  onChange={() => handleFilterChange("vehicleMake", "peugeot")}
                />
                <FilterCheckbox
                  id="make-6"
                  label="Ford"
                  checked={isFilterActive("vehicleMake", "ford")}
                  onChange={() => handleFilterChange("vehicleMake", "ford")}
                />
                <FilterCheckbox
                  id="make-7"
                  label="Others"
                  checked={isFilterActive("vehicleMake", "others")}
                  onChange={() => handleFilterChange("vehicleMake", "others")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Engine Type Filter */}
            <FilterSection
              title="Engine type"
              expanded={isFilterExpanded("engineType")}
              onToggle={() => toggleFilter("engineType")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="engine-1"
                  label="Petrol"
                  checked={isFilterActive("engineType", "petrol")}
                  onChange={() => handleFilterChange("engineType", "petrol")}
                />
                <FilterCheckbox
                  id="engine-2"
                  label="Diesel"
                  checked={isFilterActive("engineType", "diesel")}
                  onChange={() => handleFilterChange("engineType", "diesel")}
                />
                <FilterCheckbox
                  id="engine-3"
                  label="Hybrid"
                  checked={isFilterActive("engineType", "hybrid")}
                  onChange={() => handleFilterChange("engineType", "hybrid")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Vehicle Parts Filter */}
            <FilterSection
              title="Vehicle parts"
              expanded={isFilterExpanded("vehicleParts")}
              onToggle={() => toggleFilter("vehicleParts")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="parts-1"
                  label="Engine parts"
                  checked={isFilterActive("vehicleParts", "engine")}
                  onChange={() => handleFilterChange("vehicleParts", "engine")}
                />
                <FilterCheckbox
                  id="parts-2"
                  label="Brake systems"
                  checked={isFilterActive("vehicleParts", "brake")}
                  onChange={() => handleFilterChange("vehicleParts", "brake")}
                />
                <FilterCheckbox
                  id="parts-3"
                  label="Suspension parts"
                  checked={isFilterActive("vehicleParts", "suspension")}
                  onChange={() => handleFilterChange("vehicleParts", "suspension")}
                />
                <FilterCheckbox
                  id="parts-4"
                  label="Electrical parts"
                  checked={isFilterActive("vehicleParts", "electrical")}
                  onChange={() => handleFilterChange("vehicleParts", "electrical")}
                />
                <FilterCheckbox
                  id="parts-5"
                  label="Exhaust systems"
                  checked={isFilterActive("vehicleParts", "exhaust")}
                  onChange={() => handleFilterChange("vehicleParts", "exhaust")}
                />
                <FilterCheckbox
                  id="parts-6"
                  label="Body parts"
                  checked={isFilterActive("vehicleParts", "body")}
                  onChange={() => handleFilterChange("vehicleParts", "body")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Condition Filter */}
            <FilterSection
              title="Condition"
              expanded={isFilterExpanded("condition")}
              onToggle={() => toggleFilter("condition")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="condition-1"
                  label="New"
                  checked={isFilterActive("condition", "new")}
                  onChange={() => handleFilterChange("condition", "new")}
                />
                <FilterCheckbox
                  id="condition-2"
                  label="Used"
                  checked={isFilterActive("condition", "used")}
                  onChange={() => handleFilterChange("condition", "used")}
                />
                <FilterCheckbox
                  id="condition-3"
                  label="Refurbished"
                  checked={isFilterActive("condition", "refurbished")}
                  onChange={() => handleFilterChange("condition", "refurbished")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Brands Filter */}
            <FilterSection title="Brands" expanded={isFilterExpanded("brands")} onToggle={() => toggleFilter("brands")}>
              <div className="space-y-2">
                <FilterCheckbox
                  id="brands-1"
                  label="Local brands"
                  checked={isFilterActive("brands", "local")}
                  onChange={() => handleFilterChange("brands", "local")}
                />
                <FilterCheckbox
                  id="brands-2"
                  label="International brands"
                  checked={isFilterActive("brands", "international")}
                  onChange={() => handleFilterChange("brands", "international")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>

            {/* Warranty Filter */}
            <FilterSection
              title="Warranty"
              expanded={isFilterExpanded("warranty")}
              onToggle={() => toggleFilter("warranty")}
            >
              <div className="space-y-2">
                <FilterCheckbox
                  id="warranty-1"
                  label="With warranty"
                  checked={isFilterActive("warranty", "with")}
                  onChange={() => handleFilterChange("warranty", "with")}
                />
                <FilterCheckbox
                  id="warranty-2"
                  label="Without warranty"
                  checked={isFilterActive("warranty", "without")}
                  onChange={() => handleFilterChange("warranty", "without")}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={applyFilters}>
                Apply
              </Button>
            </FilterSection>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium">
              {brand.name} / {category.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by</span>
              <select
                className="text-sm border rounded-md px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-md overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].image
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                      {/* Color badge example */}
                      {product.id % 3 === 0 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-full px-3 py-1 text-xs">
                          Black
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-medium text-sm hover:text-brand-red">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-bold mt-1">₦{Number(product.amount).toLocaleString()}</p>

                    <Tabs defaultValue="camry" className="mt-2">
                      <TabsList className="grid w-full grid-cols-3 h-8">
                        <TabsTrigger value="camry" className="text-xs">
                          Camry
                        </TabsTrigger>
                        <TabsTrigger value="interior" className="text-xs">
                          Interior
                        </TabsTrigger>
                        <TabsTrigger value="salon" className="text-xs">
                          Salon
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-gray-500">
                We couldn&#39;t find any {category.name} products for {brand.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Filter Section Component
function FilterSection({
  title,
  children,
  expanded,
  onToggle,
}: {
  title: string
  children: React.ReactNode
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="mb-4">
      <button className="flex items-center justify-between w-full text-left py-2 border-b" onClick={onToggle}>
        <h3 className="text-sm font-medium">{title}</h3>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  )
}

// Filter Checkbox Component
function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center">
      <input type="checkbox" id={id} className="mr-2" checked={checked} onChange={onChange} />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  )
}

