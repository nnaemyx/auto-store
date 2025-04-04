import BrandSlider from "@/components/homepage/brand-slider";
import HeroSection from "@/components/hero-section";
import BestSellingItems from "@/components/homepage/bestSellingItems";
import CarSearch from "@/components/homepage/car-search";
import ProductHighlights from "@/components/homepage/product-highlights";
import CategorySlider from "@/components/homepage/category-slider";

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
        <CarSearch/>
      </section>

      
      <section className="md:py-15  md:px-3">
        <ProductHighlights/>
      </section>

      <section className="md:py-[48px] pl-4 py-20 md:pl-10">
        <CategorySlider/>
      </section>
    </div>
  );
}
