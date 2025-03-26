"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

// Mock product data
const products = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: "Name of Item",
  price: `₦${Math.floor(Math.random() * 100000) + 10000}`,
  image: i % 2 === 0 ? "/placeholder.svg?height=200&width=200" : "/placeholder.svg?height=200&width=200",
  tags: ["Camry", "Interior", "Salon"],
}))

// Filter options
const filterOptions = {
  priceRange: ["₦1,000 - ₦10,000", "₦10,000 - ₦50,000", "₦50,000 - ₦100,000", "₦100,000+"],
  location: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Other states"],
  vehicleMake: ["Toyota", "Honda", "Lexus", "Nissan", "Peugeot", "Ford", "Others"],
  engineType: ["Petrol", "Diesel", "Hybrid"],
  vehicleParts: [
    "Engine parts",
    "Brake systems",
    "Suspension parts",
    "Electrical parts",
    "Exhaust systems",
    "Body parts",
  ],
  condition: ["New", "Used", "Refurbished"],
  brands: ["Local brands", "International brands"],
  warranty: ["With warranty", "Without warranty"],
}

export default function CategoryPage({ params }: { params: { brand: string; category: string } }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Format brand and category names for display
  const brand = params.brand.charAt(0).toUpperCase() + params.brand.slice(1)
  const category = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 hidden md:block">
        <Link href="/" className="hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <Link href="/brands" className="hover:text-brand-red">
          Categories
        </Link>
        {" / "}
        <Link href={`/brand/${params.brand.toLowerCase()}`} className="hover:text-brand-red">
          {brand}
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">{category}</span>
      </div>

      {/* Mobile breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 md:hidden">
        <Link href={`/brand/${params.brand.toLowerCase()}`} className="hover:text-brand-red">
          {brand}
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">{category}</span>
      </div>

      {/* Mobile filter and sort controls */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
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
                <MobileFilters />
              </div>
            </div>
          </SheetContent>
        </Sheet>

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

      {/* Desktop layout with sidebar filters */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <h2 className="font-medium">Filters</h2>
            </div>
            <DesktopFilters />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Desktop sort controls */}
          <div className="hidden md:flex justify-end mb-4">
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

          {/* Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
                  <div className="relative h-40 md:h-48 bg-gray-50">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                    {product.id % 3 === 0 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-full px-3 py-1 text-xs">
                        Black
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm group-hover:text-brand-red">{product.name}</h3>
                    <p className="font-bold text-sm mt-1">{product.price}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Filters Component
function MobileFilters() {
  return (
    <div className="py-2">
      {Object.entries(filterOptions).map(([category, options]) => (
        <FilterSection key={category} title={formatCategoryTitle(category)} options={options} />
      ))}
    </div>
  )
}

// Desktop Filters Component
function DesktopFilters() {
  return (
    <div className="space-y-6">
      {Object.entries(filterOptions).map(([category, options], index) => (
        <div key={category}>
          <Collapsible defaultOpen={index < 3}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left mb-2">
              <h3 className="text-sm font-medium">{formatCategoryTitle(category)}</h3>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input type="checkbox" id={`${category}-${optionIndex}`} className="mr-2" />
                  <label htmlFor={`${category}-${optionIndex}`} className="text-sm">
                    {option}
                  </label>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                Apply
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  )
}

// Filter Section Component for Mobile
function FilterSection({ title, options }: { title: string; options: string[] }) {
  const [isOpen, setIsOpen] = useState(false)

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
              <input type="checkbox" id={`mobile-${title}-${index}`} className="mr-2" />
              <label htmlFor={`mobile-${title}-${index}`}>{option}</label>
            </div>
          ))}
          <Button className="w-full mt-2">Apply</Button>
        </div>
      )}
    </div>
  )
}

// Helper function to format category titles
function formatCategoryTitle(category: string): string {
  return category
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2")
}

