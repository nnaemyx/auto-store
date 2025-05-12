"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useManufacturer } from "@/hooks/use-manufacturers";
import { useCategory } from "@/hooks/use-categories";
import { useProductsByBrandCategory } from "@/hooks/use-products-by-brand-category";
import { Loader2, ChevronDown, ChevronUp, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProductTypes } from "@/hooks/use-product-types";
import { useProductsByType } from "@/hooks/use-products-by-type";

interface BrandCategoryProductsProps {
  brandId: number;
  categoryId: number;
}

export default function BrandCategoryProducts({
  brandId,
  categoryId,
}: BrandCategoryProductsProps) {
  const {
    data: brand,
    isLoading: brandLoading,
    isError: brandError,
  } = useManufacturer(brandId);
  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCategory(categoryId);
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMsg,
  } = useProductsByBrandCategory(brandId, categoryId);

  const [sortBy, setSortBy] = useState("relevance");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    "priceRange",
    "location",
    "vehicleMake",
    "engineType",
  ]);

  const toggleFilter = (filterType: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType]
    );
  };

  const isFilterExpanded = (filterType: string) =>
    expandedFilters.includes(filterType);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const currentValues = prev[filterType] || [];
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const isFilterActive = (filterType: string, value: string) => {
    return (activeFilters[filterType] || []).includes(value);
  };

  const handleApplyFilter = (filterType: string, selectedValues: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: selectedValues,
    }));
    console.log("Applied filters:", activeFilters);
  };

  if (brandLoading || categoryLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      </div>
    );
  }

  if (brandError || categoryError || productsError || !brand || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-4">
            {productsErrorMsg instanceof Error
              ? productsErrorMsg.message
              : "Failed to load products"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 lg:hidden items-center flex justify-between">
        <span className="font-medium text-gray-700">{category.name}</span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              className="text-sm border px-[10px] py-[8px] w-[92px] border-none rounded-[4px] bg-[#00000008]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="sort by">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center gap-2 py-[7px] px-3 lg:w-[92px] bg-[#00000008] rounded-[4px] cursor-pointer">
                <h2 className="font-[450] text-[15px]">Filters</h2>
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-lg">
              <div className="h-full bg-white px-6 py-6">
                <SheetHeader className="mb-5">
                  <SheetTitle className="text-left">Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
                  {/* Price Range Filter */}
                  <FilterSection
                    title="Price Range"
                    expanded={isFilterExpanded("priceRange")}
                    onToggle={() => toggleFilter("priceRange")}
                  >
                    <div className="space-y-2">
                      <FilterCheckbox
                        id="price-range-1"
                        label="₦1,000 - ₦10,000"
                        checked={isFilterActive("priceRange", "₦1,000 - ₦10,000")}
                        onChange={() => handleFilterChange("priceRange", "₦1,000 - ₦10,000")}
                      />
                      <FilterCheckbox
                        id="price-range-2"
                        label="₦10,000 - ₦50,000"
                        checked={isFilterActive("priceRange", "₦10,000 - ₦50,000")}
                        onChange={() => handleFilterChange("priceRange", "₦10,000 - ₦50,000")}
                      />
                      <FilterCheckbox
                        id="price-range-3"
                        label="₦50,000 - ₦100,000"
                        checked={isFilterActive("priceRange", "₦50,000 - ₦100,000")}
                        onChange={() => handleFilterChange("priceRange", "₦50,000 - ₦100,000")}
                      />
                      <FilterCheckbox
                        id="price-range-4"
                        label="₦100,000+"
                        checked={isFilterActive("priceRange", "₦100,000+")}
                        onChange={() => handleFilterChange("priceRange", "₦100,000+")}
                      />
                    </div>
                    <Button onClick={() => handleApplyFilter("priceRange", ["₦1,000 - ₦10,000", "₦10,000 - ₦50,000", "₦50,000 - ₦100,000", "₦100,000+"])} className="w-full mt-3 bg-black text-white hover:bg-black/90">
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
                        id="condition-new"
                        label="New"
                        checked={isFilterActive("condition", "New")}
                        onChange={() => handleFilterChange("condition", "New")}
                      />
                      <FilterCheckbox
                        id="condition-used"
                        label="Used"
                        checked={isFilterActive("condition", "Used")}
                        onChange={() => handleFilterChange("condition", "Used")}
                      />
                      <FilterCheckbox
                        id="condition-refurbished"
                        label="Refurbished"
                        checked={isFilterActive("condition", "Refurbished")}
                        onChange={() => handleFilterChange("condition", "Refurbished")}
                      />
                    </div>
                    <Button onClick={() => handleApplyFilter("condition", ["New", "Used", "Refurbished"])} className="w-full mt-3 bg-black text-white hover:bg-black/90">
                      Apply
                    </Button>
                  </FilterSection>

                  {/* Brands Filter */}
                  <FilterSection
                    title="Brands"
                    expanded={isFilterExpanded("brands")}
                    onToggle={() => toggleFilter("brands")}
                  >
                    <div className="space-y-2">
                      <FilterCheckbox
                        id="brands-local"
                        label="Local brands"
                        checked={isFilterActive("brands", "Local brands")}
                        onChange={() => handleFilterChange("brands", "Local brands")}
                      />
                      <FilterCheckbox
                        id="brands-international"
                        label="International brands"
                        checked={isFilterActive("brands", "International brands")}
                        onChange={() => handleFilterChange("brands", "International brands")}
                      />
                    </div>
                    <Button onClick={() => handleApplyFilter("brands", ["Local brands", "International brands"])} className="w-full mt-3 bg-black text-white hover:bg-black/90">
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
                        id="warranty-with"
                        label="With warranty"
                        checked={isFilterActive("warranty", "With warranty")}
                        onChange={() => handleFilterChange("warranty", "With warranty")}
                      />
                      <FilterCheckbox
                        id="warranty-without"
                        label="Without warranty"
                        checked={isFilterActive("warranty", "Without warranty")}
                        onChange={() => handleFilterChange("warranty", "Without warranty")}
                      />
                    </div>
                    <Button onClick={() => handleApplyFilter("warranty", ["With warranty", "Without warranty"])} className="w-full mt-3 bg-black text-white hover:bg-black/90">
                      Apply
                    </Button>
                  </FilterSection>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 border-t mt-4 border-[#00000012]">
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

        {/* Main Content */}
        <div className="flex-1 lg:py-7">
          {/* Desktop sort controls */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="text-sm text-gray-500 hidden md:block">
              <Link
                href={`/brands/${brandId}`}
                className="hover:text-brand-red"
              >
                {brand.name}
              </Link>
              {" / "}
              <span className="font-medium text-gray-700">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border px-[10px] py-[7px] w-[92px] border-none rounded-[4px] bg-[#00000008]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="sort by">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:mt-6">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="bg-white lg:rounded-md overflow-hidden transition-all group-hover:shadow-md">
                      <div className="relative h-40 md:h-48 bg-gray-50">
                        <Image
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].image
                              : "/placeholder.svg?height=200&width=200"
                          }
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
                        <h3 className="font-medium text-sm group-hover:text-brand-red">
                          {product.name}
                        </h3>
                        <p className="font-bold text-sm mt-1">
                          ₦{Number(product.amount).toLocaleString()}
                        </p>
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
            ) : (
              <div className="text-center py-12">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-gray-500">
                  We couldn&#39;t find any {category.name} products for{" "}
                  {brand.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter and sort controls */}
      <div className="flex items-center justify-end mb-4 mt-[14px] md:hidden">
        <Sheet>
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
                <MobileFilters onApplyFilter={handleApplyFilter} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

// Filter Section Component
function FilterSection({
  title,
  children,
  expanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full text-left py-2"
        onClick={onToggle}
      >
        <h3 className="text-sm font-medium">{title}</h3>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  );
}

// Filter Checkbox Component
function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className="mr-2"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  );
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

// Desktop Filters Component
function DesktopFilters({ onApplyFilter }: { onApplyFilter: (filterType: string, values: string[]) => void }) {
  const { data: productTypes = [] } = useProductTypes()
  const { data: products } = useProductsByType("", {})

  // Calculate price ranges based on available products
  const priceRanges = useMemo(() => {
    if (!products || products.length === 0) return []
    
    const prices = products.map(p => Number(p.amount))
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
    <div className="py-2">
      {/* Price Range Filter */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full px-4 py-3">
          <span className="font-medium">Price Range</span>
          <ChevronDown className="h-5 w-5 transition-transform" />
        </button>
        <div className="px-4 pb-4 space-y-2">
          <FilterOptions 
            options={priceRanges} 
            filterType="priceRange" 
            onApplyFilter={onApplyFilter}
            inputType="radio"
          />
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full px-4 py-3">
          <span className="font-medium">Product Type</span>
          <ChevronDown className="h-5 w-5 transition-transform" />
        </button>
        <div className="px-4 pb-4 space-y-2">
          <FilterOptions 
            options={productTypes} 
            filterType="productType" 
            onApplyFilter={onApplyFilter}
            inputType="checkbox"
          />
        </div>
      </div>
    </div>
  )
}

// Mobile Filters Component
function MobileFilters({ onApplyFilter }: { onApplyFilter: (filterType: string, values: string[]) => void }) {
  const { data: productTypes = [] } = useProductTypes()
  const { data: products } = useProductsByType("", {})

  // Calculate price ranges based on available products
  const priceRanges = useMemo(() => {
    if (!products || products.length === 0) return []
    
    const prices = products.map(p => Number(p.amount))
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
    <div className="flex flex-col h-full">
      {/* Price Range Filter */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full px-4 py-3">
          <span className="font-medium">Price Range</span>
          <ChevronDown className="h-5 w-5 transition-transform" />
        </button>
        <div className="px-4 pb-4 space-y-2">
          <FilterOptions 
            options={priceRanges} 
            filterType="priceRange" 
            onApplyFilter={onApplyFilter}
            inputType="radio"
          />
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full px-4 py-3">
          <span className="font-medium">Product Type</span>
          <ChevronDown className="h-5 w-5 transition-transform" />
        </button>
        <div className="px-4 pb-4 space-y-2">
          <FilterOptions 
            options={productTypes} 
            filterType="productType" 
            onApplyFilter={onApplyFilter}
            inputType="checkbox"
          />
        </div>
      </div>
    </div>
  )
}
