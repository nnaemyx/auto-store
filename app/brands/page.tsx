import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop by Automobile Brand | Auto Store",
  description: "Browse auto parts by car brand including Toyota, Lexus, Honda, and more",
}

const brands = [
  { name: "Toyota", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Lexus", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Honda", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Jeep", logo: "/placeholder.svg?height=100&width=100" },
  { name: "BMW", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Mercedes", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Car brand", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Car brand", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Nissan", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Ford", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Audi", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Volkswagen", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Mazda", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Car brand", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Car brand", logo: "/placeholder.svg?height=100&width=100" },
  { name: "Others", logo: "/placeholder.svg?height=100&width=100" },
]

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shop by Automobile Brand</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
        {brands.map((brand, index) => (
          <Link key={index} href={`/brand/${brand.name.toLowerCase()}`} className="flex flex-col items-center group">
            <div className="bg-gray-50 rounded-full p-4 w-[80px] h-[80px] flex items-center justify-center mb-2 transition-all group-hover:shadow-md">
              <div className="relative h-12 w-12">
                <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
            </div>
            <span className="text-sm text-center">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

