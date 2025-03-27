"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CategoryCardProps {
  title: string
  image: string
  link: string
  subtitle?: string
}

const categories: CategoryCardProps[] = [
  {
    title: "Engine Parts",
    image: "/images/pexels-markusspiske-2027045.png",
    link: "/category/engine-parts",
  },
  {
    title: "Only Classics",
    image: "/images/pexels-julius-weidenauer-296473414-28292055.png",
    link: "/category/classics",
  },
  {
    title: "Turbo Chargers",
    image: "/images/pexels-cottonbro-7565163.png",
    link: "/category/turbo-chargers",
  },
  {
    title: "Transmission",
    image: "/images/pexels-cottonbro-4489765.png",
    link: "/category/transmission",
  },
]

const CategoryCard = ({ title, image, link, subtitle }: CategoryCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg lg:h-[460px] h-[363.16px] flex-shrink-0 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover brightness-[0.55] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end text-center p-6 text-white">
        <h3 className="md:text-[18px] text-[16px] font-medium mb-2">
          {title} {subtitle && <span className="font-normal text-lg">{subtitle}</span>}
        </h3>
        <div>
          <Button
            asChild
            variant="outline"
            className="border-white text-white text-[15px] font-[450] rounded-[4px] border-[1.5px] hover:bg-white hover:text-black transition-colors"
          >
            <Link href={link}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CategorySlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const visibleItems = isMobile ? 1 : 4
  const maxIndex = categories.length - visibleItems

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  useEffect(() => {
    if (sliderRef.current) {
      const scrollAmount = (sliderRef.current.scrollWidth / categories.length) * currentIndex
      sliderRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  // Reset index when screen size changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [isMobile])

  return (
    <section className="">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6 md:pr-10">
          <h2 className="text-[16px] text-center mx-auto md:mx-0 lg:text-left font-medium">Shop these Categories</h2>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative md:mt-[44px]">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => (
              <div key={index} className={`${isMobile ? " w-[300px]" : "w-[380px]"} flex-shrink-0 snap-start`}>
                <CategoryCard
                  title={category.title}
                  subtitle={category.subtitle}
                  image={category.image}
                  link={category.link}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

