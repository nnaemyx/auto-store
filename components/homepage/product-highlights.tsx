import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HighlightCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const HighlightCard = ({
  title,
  description,
  image,
  link,
}: HighlightCardProps) => {
  return (
    <div className="relative overflow-hidden md:rounded-lg h-[740px] md:h-[600px] group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image || "/placeholder.svg"}
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
            <Link href={link}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProductHighlights() {
  const highlights = [
    {
      title: "Lubricants",
      description:
        "Ensure your engines and parts are protected from wear and tear by using oil from the lubricants section.",
      image: "/images/lubricant.png",
      link: "/category/lubricants",
    },
    {
      title: "Wheels and Absorbers",
      description:
        "Looking for wheel and suspension mods, find all of them in this section!",
      image: "/images/wheels.png",
      link: "/category/wheels-absorbers",
    },
    {
      title: "Rims",
      description:
        "Whether chrome, matte and shiny wheels, you can get any of them to spice up your automobile.",
      image: "/images/rim.png",
      link: "/category/rims",
    },
  ];

  return (
    <section className="">
      <div className=" mx-auto">
        <div className="flex flex-col  md:grid md:grid-cols-1 gap-6">
          {highlights.map((highlight, index) => (
            <HighlightCard
              key={index}
              title={highlight.title}
              description={highlight.description}
              image={highlight.image}
              link={highlight.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
