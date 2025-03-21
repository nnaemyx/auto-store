import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
      {/* Image layer */}
      <div className="absolute inset-0">
        <Image
          src="/images/pexels-tima-miroshnichenko-5640634 1.png"
          alt="Just Tires"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      
      {/* Content layer */}
      <div className="absolute inset-0 flex items-end z-20 px-[60px]">
        <div className="container mx-auto flex justify-between items-baseline pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-none text-white">
              Just Tires
            </h1>
            <p className="text-gray-200 text-lg md:text-base font-normal max-w-md mt-2">
              Explore our vast collection of car tires for all your normal,
              track and off road needs.
            </p>
          </div>
          <div>
            <Button size="lg" className="bg-white w-[186px] text-black hover:bg-gray-200">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;