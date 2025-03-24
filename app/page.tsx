import BrandSlider from "@/components/brand-slider";
import HeroSection from "@/components/hero-section";
import BestSellingItems from "@/components/homepage/bestSellingItems";

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
    </div>
  );
}
