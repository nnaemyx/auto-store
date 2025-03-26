import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Brand Categories | Auto Store",
  description: "Browse categories for your selected automobile brand",
}

// Mock data for categories
const categoriesByBrand: Record<string, { name: string; image: string }[]> = {
  lexus: [
    { name: "Transmission system", image: "/placeholder.svg?height=100&width=100" },
    { name: "Cylinder head", image: "/placeholder.svg?height=100&width=100" },
    { name: "Windows", image: "/placeholder.svg?height=100&width=100" },
    { name: "Door handles", image: "/placeholder.svg?height=100&width=100" },
    { name: "Car seat", image: "/placeholder.svg?height=100&width=100" },
    { name: "Filters", image: "/placeholder.svg?height=100&width=100" },
    { name: "Belt", image: "/placeholder.svg?height=100&width=100" },
    { name: "Bumper", image: "/placeholder.svg?height=100&width=100" },
    { name: "Suspension and steering", image: "/placeholder.svg?height=100&width=100" },
    { name: "Brake pads and disks", image: "/placeholder.svg?height=100&width=100" },
    { name: "Fenders", image: "/placeholder.svg?height=100&width=100" },
    { name: "Exterior & Interior accessories", image: "/placeholder.svg?height=100&width=100" },
  ],
  toyota: [
    { name: "Transmission system", image: "/placeholder.svg?height=100&width=100" },
    { name: "Cylinder head", image: "/placeholder.svg?height=100&width=100" },
    { name: "Windows", image: "/placeholder.svg?height=100&width=100" },
    { name: "Door handles", image: "/placeholder.svg?height=100&width=100" },
    { name: "Car seat", image: "/placeholder.svg?height=100&width=100" },
    { name: "Filters", image: "/placeholder.svg?height=100&width=100" },
  ],
}

// Mock data for popular items
const popularItems = [
  {
    name: "Name of Item",
    price: "₦50,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦75,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦120,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦45,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦65,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦90,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦110,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    name: "Name of Item",
    price: "₦55,000",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
]

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = params.brand.toLowerCase()

  // Get categories for this brand or use a default set
  const categories = categoriesByBrand[brand] || categoriesByBrand.lexus

  // If no categories found, return 404
  if (!categories) {
    notFound()
  }

  // Format brand name for display (capitalize first letter)
  const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-red">
          Homepage
        </Link>
        {" / "}
        <Link href="/brands" className="hover:text-brand-red">
          Categories
        </Link>
        {" / "}
        <span className="font-medium text-gray-700">{formattedBrand}</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">Categories Under {formattedBrand}</h1>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 mb-12">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/brand/${brand}/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex flex-col items-center group"
          >
            <div className="bg-gray-50 rounded-full p-4 w-[80px] h-[80px] flex items-center justify-center mb-2 transition-all group-hover:shadow-md">
              <div className="relative h-12 w-12">
                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-contain" />
              </div>
            </div>
            <span className="text-sm text-center">{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Popular Items */}
      <h2 className="text-xl font-bold mb-6">Popular Items from {formattedBrand}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {popularItems.slice(0, 8).map((item, index) => (
          <Link key={index} href={`/product/${index}`} className="group">
            <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
              <div className="relative h-48 bg-gray-50">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain p-4" />
              </div>
              <div className="p-4">
                <h3 className="font-medium group-hover:text-brand-red">{item.name}</h3>
                <p className="font-bold mt-1">{item.price}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
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
  )
}

