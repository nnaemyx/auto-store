"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Mock product data
const products = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: "Name of Item",
  price: `₦${Math.floor(Math.random() * 100000) + 10000}`,
  image:
    i % 2 === 0
      ? "/placeholder.svg?height=200&width=200"
      : "/placeholder.svg?height=200&width=200",
  tags: ["Camry", "Interior", "Salon"],
}));

// Filter options
const filterOptions = {
  priceRange: [
    "₦1,000 - ₦10,000",
    "₦10,000 - ₦50,000",
    "₦50,000 - ₦100,000",
    "₦100,000+",
  ],
  vehicleMake: [
    "Toyota",
    "Honda",
    "Lexus",
    "Nissan",
    "Peugeot",
    "Ford",
    "Others",
  ],
  //   engineType: ["Petrol", "Diesel", "Hybrid"],
  vehicleParts: [
    "Engine parts",
    "Brake systems",
    "Suspension parts",
    "Electrical parts",
    "Exhaust systems",
    "Body parts",
  ],
  condition: ["New", "Used", "Refurbished"],
};

interface ProductCategoryPageProps {
  brand: string;
  brandDisplay: string;
  category: string;
  categoryDisplay: string;
}

export default function ProductCategoryPage({
  brand,
  brandDisplay,

  categoryDisplay,
}: ProductCategoryPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  return (
    <div className=" mx-auto">
      {/* Breadcrumb */}

      {/* Mobile filter and sort controls */}
      <div className="flex items-center justify-between mb-4 px-[16px] lg:hidden">
        {/* Mobile breadcrumb */}
        <div className="text-sm text-gray-500 lg:hidden">
          <span className="font-medium text-gray-700">{categoryDisplay}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              className="text-sm w-[69px] rounded-[8px] bg-[#0000000A] px-[8.5px] h-9"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="sort by">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-[62px] h-[36px] px-[8.5px] py-3 bg-[#0000000A] border-none rounded-[8px]">
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <MobileFilters />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop layout with sidebar filters */}
      <div className="flex flex-col md:flex-row gap-5 lg:border-t border-[#00000012]">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 lg:border-r border-[#00000012] px-5 py-7 flex-shrink-0">
          <div className="sticky">
            <div className="flex items-center gap-2 mb-4 py-[7px] px-3 lg:w-[92px] bg-[#00000008] rounded-[4px]">
              <h2 className="font-[450] text-[15px]">Filters</h2>
              <Filter className="size-[18px]" />
            </div>
            <DesktopFilters />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 py-7">
          {/* Desktop sort controls */}

          <div className="hidden lg:flex justify-between items-center">
            <div className="text-sm text-gray-500 hidden md:block">
              <Link href={`/brand/${brand}`} className="hover:text-brand-red">
                {brandDisplay}
              </Link>
              {" / "}
              <span className="font-medium text-gray-700">
                {categoryDisplay}
              </span>
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

          {/* Products */}
          <div className="lg:mt-6">
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
                      <h3 className="font-medium text-sm group-hover:text-brand-red">
                        {product.name}
                      </h3>
                      <p className="font-bold text-sm mt-1">{product.price}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                          >
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
    </div>
  );
}

// Mobile Filters Component
function MobileFilters() {
  return (
    <div className="py-2">
      {Object.entries(filterOptions).map(([category, options]) => (
        <FilterSection
          key={category}
          title={formatCategoryTitle(category)}
          options={options}
        />
      ))}
    </div>
  );
}

// Desktop Filters Component
function DesktopFilters() {
  return (
    <div className="space-y-6 lg:mt-8">
      {Object.entries(filterOptions).map(([category, options], index) => (
        <div key={category}>
          <Collapsible defaultOpen={index < 3}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left mb-2">
              <h3 className="text-sm font-normal">
                {formatCategoryTitle(category)}
              </h3>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-5 lg:mt-5">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${category}-${optionIndex}`}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`${category}-${optionIndex}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </label>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-black text-white"
              >
                Apply
              </Button>
              <hr className="w-full mt-6 border-[#00000014]" />
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}

// Filter Section Component for Mobile
function FilterSection({
  title,
  options,
}: {
  title: string;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <button
        className="flex items-center justify-between w-full px-4 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-normal text-[14px]">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-5">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`mobile-${title}-${index}`}
                className="mr-2"
              />
              <label className="text-[14px]" htmlFor={`mobile-${title}-${index}`}>{option}</label>
            </div>
          ))}
          <Button className="w-full mt-2 bg-black text-white">Apply</Button>
        </div>
      )}
    </div>
  );
}

// Helper function to format category titles
function formatCategoryTitle(category: string): string {
  return category
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}
