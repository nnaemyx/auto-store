"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { Loader2 } from "lucide-react"

interface HighlightCardProps {
  title: string
  description: string
  image: string
  link: string
  categoryId: number
}

const HighlightCard = ({ title, description, image, categoryId }: HighlightCardProps) => {
  return (
    <div className="relative overflow-hidden md:rounded-lg h-[740px] md:h-[600px] group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image }
          alt={title}
          fill
          className="object-cover brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      {/* Content Overlay */}
      <div className="absolute inset-0 flex md:flex-row flex-col justify-end z-10 md:items-end md:justify-between p-6 text-white">
        <div className="md:text-left text-center">
          <h3 className="text-2xl md:text-[60px] font-semibold">{title}</h3>
          <p className=" md:text-base mt-2 md:mt-0 text-[#DCDCDC] max-w-[563px]">{description}</p>
        </div>
        <div className="md:self-end">
          <Button asChild className="bg-white mt-6 md:mt-0 text-black w-[167px] mx-auto md:w-auto md:mx-0 flex justify-center hover:bg-gray-100">
          <Link href={`/products?category_id=${categoryId}`}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProductHighlights() {
  // Define the image paths using the public directory
  const lubricantsImage = "/images/lubricant.png"
  const wheelsImage = "/images/wheels.png"
  const rimsImage = "/images/rim.png"

  // Featured images to use with categories
  const featuredImages = [lubricantsImage, wheelsImage, rimsImage]

  // Default descriptions in case categories don't have them
  const defaultDescriptions = [
    "Ensure your engines and parts are protected from wear and tear by using oil from the lubricants section.",
    "Looking for wheel and suspension mods, find all of them in this section!",
    "Whether chrome, matte and shiny wheels, you can get any of them to spice up your automobile.",
  ]

  // Get all categories
  const { data: categories, isLoading, isError } = useCategories()

  if (isLoading) {
    return (
      <section className="">
        <div className="mx-auto">

          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
          </div>
        </div>
      </section>
    )
  }

  if (isError || !categories || categories.length === 0) {
    return (
      <section className="">
        <div className=" mx-auto">
          <div className="text-center py-8">
            <p>Unable to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  // Get the first 3 categories to feature
  const featuredCategories = categories.slice(0, 3).map((cat, index) => ({
    title: cat.name,
    description: cat.description || defaultDescriptions[index % defaultDescriptions.length],
    image: featuredImages[index % featuredImages.length],
    link: `/products?category_id=${cat.id}`,
    categoryId: cat.id,
  }))

  return (
    <section className="">
      <div className=" mx-auto">
        
        <div className="grid md:grid-cols-1 gap-6">
          {featuredCategories.map((highlight, index) => (
            <HighlightCard
              key={index}
              title={highlight.title}
              description={highlight.description}
              image={highlight.image}
              link={highlight.link}
              categoryId={highlight.categoryId}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

