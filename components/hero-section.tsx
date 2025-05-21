import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative h-[740px] lg:h-[600px] w-full overflow-hidden lg:rounded-lg">
      {/* Video layer */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/mmainspire/video/upload/v1747790663/guix6akzfpem1ojho5lg.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      
      {/* Content layer */}
      <div className="absolute inset-0 flex items-end z-20 px-[16px] lg:px-[60px]">
        <div className="container mx-auto lg:mx-0 flex lg:flex-row flex-col justify-center lg:justify-between items-baseline lg:pb-6 pb-[44px] ">
          <div className="mx-auto lg:mx-0">
            <h1 className="text-[24px] lg:text-6xl lg:text-left text-center font-semibold tracking-tight leading-none text-white">
              Just Tires
            </h1>
            <p className="text-gray-200 lg:text-base lg:text-left text-center font-normal max-w-md mt-2">
              Explore our vast collection of car tires for all your normal,
              track and off road needs.
            </p>
          </div>
          <Link href="/product" className="mx-auto lg:mx-0 mt-[24px] lg:mt-0">
            <Button size="lg" className="bg-white lg:w-[186px] w-[167px] text-black hover:bg-gray-200">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;