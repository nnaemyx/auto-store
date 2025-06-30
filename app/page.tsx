import BrandSlider from "@/components/homepage/brand-slider";
import HeroSection from "@/components/hero-section";
import BestSellingItems from "@/components/homepage/bestSellingItems";
import CarSearch from "@/components/homepage/car-search";
import ProductHighlights from "@/components/homepage/product-highlights";
import CategorySlider from "@/components/homepage/category-slider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col lg:px-[12px] min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Car Brands */}
      <section className="md:py-20 py-25 md:px-10 px-4">
        <BrandSlider />
      </section>

      {/* Featured Categories */}
      <section className="md:py-20 lg:px-10">
        <div className="md:container md:mx-auto">
          <BestSellingItems />
        </div>
      </section>

      <section className="md:py-15 py-20 md:px-10 px-4">
        <CarSearch />
      </section>

      <section className="md:py-15  md:px-3">
        <ProductHighlights />
      </section>

      <section className="md:py-[48px] pl-4 py-20 md:pl-10">
        <CategorySlider />
      </section>

      <div className="flex justify-center px-8">
        <Link href="/custom-order">
          <Button
            className="w-[350px] text-white bg-black hover:bg-brand-red/90 px-10 py-4 text-[14px] md:text-lg font-semibold shadow-lg transition-transform duration-150 hover:scale-105 focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
            aria-label="Make a Custom Order"
          >
            <span className="flex items-center text-[13px] justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Can&apos;t find what you need? Make a Custom Order
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
