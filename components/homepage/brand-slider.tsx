"use client"

import Image from "next/image"
import Link from "next/link"

const brands = [
  { name: "Toyota", logo: "/images/toyota-logo-2020-europe-download.png" },
  { name: "Lexus", logo: "/images/Lexus-logo-1988-1920x1080.png" },
  { name: "Honda", logo: "/images/honda-logo-2000-full-download (1).png" },
  { name: "Jeep", logo: "/images/jeep-logo-1993-download.png" },
  { name: "BMW", logo: "/images/bmw-logo-1997-download.png" },
  { name: "Mercedes", logo: "/images/Mercedes-Benz-logo-2011-1920x1080.png" },
  { name: "Mercedes", logo: "/images/Mercedes-Benz-logo-2011-1920x1080.png" },
  { name: "Mercedes", logo: "/images/Mercedes-Benz-logo-2011-1920x1080.png" },
  { name: "Nissan", logo: "/images/nissan-logo-2020-white.png" },
  { name: "Ford", logo: "/images/ford-logo-2017-640.png" },
  { name: "Audi", logo: "/images/audi-logo-2016-download.png" },
  { name: "Volkswagen", logo: "/images/Volkswagen-logo-2019-1500x1500.png" },
  { name: "Mazda", logo: "/images/mazda-logo-2018-vertical-640.png" },
  { name: "Others", logo: "/images/ford-logo-2017-640.png" },
  { name: "Others", logo: "/images/ford-logo-2017-640.png" },
  { name: "Others", logo: "/images/ford-logo-2017-640.png" },
]

const BrandSlider = () => {
  return (
    <div>
      <h2 className="text-lg tracking-[-4%] md:text-left text-center font-medium mb-6">Shop by Automobile Brand</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 space-y-[56px]">
        {brands.map((brand, index) => (
          <Link key={index} href={`/brand/${brand.name.toLowerCase()}`} className="flex flex-col mx-auto">
            <div className="bg-gray-50 rounded-full w-[80px] h-[80px] flex items-center justify-center mb-2">
              <div className="relative h-12 w-12">
                <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
            </div>
            <span className="text-sm font-medium px-4 md:px-0 tracking-[-3%]">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BrandSlider

