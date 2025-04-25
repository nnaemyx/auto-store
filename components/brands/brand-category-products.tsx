"use client";

import type React from "react";

import { useState } from "react";
import { useManufacturer } from "@/hooks/use-manufacturers";
import { useCategory } from "@/hooks/use-categories";
import { useProductsByBrandCategory } from "@/hooks/use-products-by-brand-category";
import { Loader2, ChevronDown, ChevronUp, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
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

  const applyFilters = () => {
    // In a real app, this would update the query parameters and refetch products
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
                        id="price-1-mobile"
                        label="₦1,000 - ₦10,000"
                        checked={isFilterActive("priceRange", "1000-10000")}
                        onChange={() => handleFilterChange("priceRange", "1000-10000")}
                      />
                      <FilterCheckbox
                        id="price-2-mobile"
                        label="₦10,000 - ₦50,000"
                        checked={isFilterActive("priceRange", "10000-50000")}
                        onChange={() => handleFilterChange("priceRange", "10000-50000")}
                      />
                      <FilterCheckbox
                        id="price-3-mobile"
                        label="₦50,000 - ₦100,000"
                        checked={isFilterActive("priceRange", "50000-100000")}
                        onChange={() => handleFilterChange("priceRange", "50000-100000")}
                      />
                      <FilterCheckbox
                        id="price-4-mobile"
                        label="₦100,000+"
                        checked={isFilterActive("priceRange", "100000+")}
                        onChange={() => handleFilterChange("priceRange", "100000+")}
                      />
                    </div>
                    <Button onClick={applyFilters} className="w-full mt-3 bg-black text-white hover:bg-black/90">
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
                        id="condition-1-mobile"
                        label="New"
                        checked={isFilterActive("condition", "new")}
                        onChange={() => handleFilterChange("condition", "new")}
                      />
                      <FilterCheckbox
                        id="condition-2-mobile"
                        label="Used"
                        checked={isFilterActive("condition", "used")}
                        onChange={() => handleFilterChange("condition", "used")}
                      />
                      <FilterCheckbox
                        id="condition-3-mobile"
                        label="Refurbished"
                        checked={isFilterActive("condition", "refurbished")}
                        onChange={() => handleFilterChange("condition", "refurbished")}
                      />
                    </div>
                    <Button onClick={applyFilters} className="w-full mt-3 bg-black text-white hover:bg-black/90">
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
                        id="brands-1-mobile"
                        label="Local brands"
                        checked={isFilterActive("brands", "local")}
                        onChange={() => handleFilterChange("brands", "local")}
                      />
                      <FilterCheckbox
                        id="brands-2-mobile"
                        label="International brands"
                        checked={isFilterActive("brands", "international")}
                        onChange={() => handleFilterChange("brands", "international")}
                      />
                    </div>
                    <Button onClick={applyFilters} className="w-full mt-3 bg-black text-white hover:bg-black/90">
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
                        id="warranty-1-mobile"
                        label="With warranty"
                        checked={isFilterActive("warranty", "with")}
                        onChange={() => handleFilterChange("warranty", "with")}
                      />
                      <FilterCheckbox
                        id="warranty-2-mobile"
                        label="Without warranty"
                        checked={isFilterActive("warranty", "without")}
                        onChange={() => handleFilterChange("warranty", "without")}
                      />
                    </div>
                    <Button onClick={applyFilters} className="w-full mt-3 bg-black text-white hover:bg-black/90">
                      Apply
                    </Button>
                  </FilterSection>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 lg:border-t border-[#00000012]">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-64 lg:border-r border-[#00000012] px-5 py-7 flex-shrink-0">
          <div className="sticky">
            <div className="flex items-center gap-2 mb-4 py-[7px] px-3 lg:w-[92px] bg-[#00000008] rounded-[4px]">
              <h2 className="font-[450] text-[15px]">Filters</h2>
              <Filter className="size-[18px]" />
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
                  onChange={() =>
                    handleFilterChange("priceRange", "1000-10000")
                  }
                />
                <FilterCheckbox
                  id="price-2"
                  label="₦10,000 - ₦50,000"
                  checked={isFilterActive("priceRange", "10000-50000")}
                  onChange={() =>
                    handleFilterChange("priceRange", "10000-50000")
                  }
                />
                <FilterCheckbox
                  id="price-3"
                  label="₦50,000 - ₦100,000"
                  checked={isFilterActive("priceRange", "50000-100000")}
                  onChange={() =>
                    handleFilterChange("priceRange", "50000-100000")
                  }
                />
                <FilterCheckbox
                  id="price-4"
                  label="₦100,000+"
                  checked={isFilterActive("priceRange", "100000+")}
                  onChange={() => handleFilterChange("priceRange", "100000+")}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 bg-black text-white"
                onClick={applyFilters}
              >
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
                  onChange={() =>
                    handleFilterChange("condition", "refurbished")
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 bg-black text-white"
                onClick={applyFilters}
              >
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
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 bg-black text-white"
                onClick={applyFilters}
              >
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
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 bg-black text-white"
                onClick={applyFilters}
              >
                Apply
              </Button>
            </FilterSection>
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
