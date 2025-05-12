"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCategories } from "@/hooks/use-categories";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
  subtitle?: string;
  categoryId: number;
}

// Default images to use for categories
const categoryImages = [
  "/images/pexels-markusspiske-2027045.png",
  "/images/pexels-julius-weidenauer-296473414-28292055.png",
  "/images/pexels-cottonbro-7565163.png",
  "/images/pexels-cottonbro-4489765.png",
];

const CategoryCard = ({
  title,
  image,
  subtitle,
  categoryId,
}: CategoryCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg lg:h-[460px] h-[363.16px] flex-shrink-0 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover brightness-[0.55] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end text-center p-6 text-white">
        <h3 className="md:text-[18px] text-[16px] font-medium mb-2">
          {title}{" "}
          {subtitle && <span className="font-normal text-lg">{subtitle}</span>}
        </h3>
        <div>
          <Button
            asChild
            variant="outline"
            className="border-white text-white text-[15px] font-[450] rounded-[4px] border-[1.5px] hover:bg-white hover:text-black transition-colors"
          >
            <Link href={`/products?category_id=${categoryId}`}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function CategorySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Get all categories
  const { data: categories, isLoading, isError } = useCategories();

  // Map categories to our display format
  const categoryCards = categories
    ? categories.slice(0, 8).map((category, index) => ({
        title: category.name,
        subtitle: index === 0 ? "(From USA)" : undefined, // Just add a subtitle to the first one as an example
        image: categoryImages[index % categoryImages.length], // Cycle through our existing images
        link: `/products?category_id=${category.id}`,
        categoryId: category.id,
      }))
    : [];

  const visibleItems = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, categoryCards.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  useEffect(() => {
    if (sliderRef.current && categoryCards.length > 0) {
      const scrollAmount =
        (sliderRef.current.scrollWidth / categoryCards.length) * currentIndex;
      sliderRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [currentIndex, categoryCards.length]);

  // Reset index when screen size changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  if (isLoading) {
    return (
      <section className="">
        <div className=" mx-auto">
          <h2 className="text-xl font-bold mb-6">Shop these Categories</h2>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return (
      <section className=" ">
        <div className=" mx-auto">
          <h2 className="text-xl font-bold mb-6">Shop these Categories</h2>
          <div className="text-center py-8">
            <p>Unable to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6  md:pr-10">
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
            {categoryCards.map((category, index) => (
              <div
                key={index}
                className={`${
                  isMobile ? "w-[300px]" : "w-[380px]"
                } flex-shrink-0 snap-start`}
              >
                <CategoryCard
                  title={category.title}
                  subtitle={category.subtitle}
                  image={category.image}
                  link={category.link}
                  categoryId={category.categoryId}
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
        <div className="mt-16 mb-8 text-center bg-gray-50 py-12 px-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Did not see what you are looking for?</h2>
          <p className="text-gray-600 mb-8">Make a custom order with us</p>
          <Button asChild className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg">
            <Link href="/custom-order">Custom Order</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
