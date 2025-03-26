"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock product data
const productData = {
  id: "1",
  name: "Toyota Camry Leather Seat Liners",
  price: "₦40,000 - ₦60,000",
  description:
    "The worlds first 12-week complete optimization system that seamlessly integrates into your lifestyle, and gets you on track to achieving your goals.",
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  specifications: {
    weight: "10.5 kg",
    dimensions: "234 by 456 cm",
    color: "Black",
    material: "Leather",
    compatibility: "SUV",
    warranty: "1 year limited",
    condition: "New",
    origin: "Order shipped",
    sku: "SKU123456",
    inventory: "In stock",
  },
  reviews: [
    {
      id: 1,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 3,
      dislikes: 0,
    },
    {
      id: 2,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 1,
      dislikes: 0,
    },
    {
      id: 3,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 5,
      dislikes: 1,
    },
    {
      id: 4,
      user: "Name of customer",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "3 months ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 2,
      dislikes: 0,
    },
  ],
  rating: 4.8,
  reviewCount: 500,
};

// Mock related products
const popularItems = [
  {
    id: "2",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "3",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "4",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "5",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "6",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "7",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "8",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
  {
    id: "9",
    name: "Name of Item",
    price: "Pricing",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Camry", "Interior", "Salon"],
  },
];

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [mainImage, setMainImage] = useState(productData.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const fetchParams = async () => {
    const { id } = await params;
    console.log(id); // Use the id as needed
  };

  fetchParams();

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto px-4 lg:px-20 py-5 lg:py-10">
      {/* Product Details Section */}
      <div className="flex lg:flex-row flex-col gap-10 mb-8">
        {/* Product Images */}
        <div className="space-y-4 md:max-w-[840px] w-full">
          <div className="relative h-[300px] md:h-[640px]  bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={mainImage || "/placeholder.svg"}
              alt={productData.name}
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {productData.images.map((image, index) => (
              <div
                key={index}
                className="relative max-w-[201px] w-full h-[160px] flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer hover:border-brand-red"
                onClick={() => setMainImage(image)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productData.name} - Image ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 md:max-w-[400px] w-full">
          <div>
            <h1 className="text-[20px] lg:tracking-[-4%] lg:leading-[120%] md:text-[40px] font-[450]">
              {productData.name}
            </h1>
            <p className="text-xl md:text-2xl font-semibold mt-2.5">
              {productData.price}
            </p>
          </div>

          <p className="text-[#595959] text-[15px] md:leading-[140%] md:tracking-[-2%]">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-2 mt-8">
            <label htmlFor="size" className="block text-sm font-medium">
              Select size
            </label>
            <select
              id="size"
              className="w-full bg-[#00000008] rounded-[4px] text-[14px] py-2.5 px-2 border border-solid border-[#00000005]"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label htmlFor="color" className="block text-sm font-medium">
              Colour
            </label>
            <select
              id="color"
              className="w-full bg-[#00000008] text-[14px] rounded-[4px] py-2.5 px-2 border border-solid border-[#00000005]"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Select colour</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Quantity</label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="size-[36px] rounded-[4px] border-none bg-[#00000008]"
              >
                <Minus className="size-[18px]" />
              </Button>
              <span className="mx-4 min-w-[296px] border border-solid border-[#00000008] bg-[#00000008] rounded-[4px] py-[6px] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="size-[36px] rounded-[4px] border-none bg-black"
              >
                <Plus className="size-[18px] text-white" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-black text-white rounded-[4px]">
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-[#00000008] rounded-[4px] border-none"
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex rounded-[4px] border-none bg-[#00000008]"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex lg:flex-row flex-col gap-10">
        <div className="lg:max-w-[840px] w-full">
          <div className="mb-8">
            <h2 className="text-[16px] font-medium mb-2.5">Description</h2>
            <div className="space-y-4 text-gray-700">
              <p>{productData.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
          <div className="mb-8 rounded-[8px] border border-solid border-[#EDEDED] p-[20px]">
            <h2 className="text-[16px] font-medium mb-4">
              Product rating ({productData.rating} from{" "}
              {productData.reviewCount} ratings)
            </h2>
            <div className="space-y-6 mt-9">
              {productData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-[#00000012] pb-6"
                >
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.avatar}
                        alt={review.user}
                        className="size-[40px] bg-gray-300 rounded-full"
                      />
                      <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="font-medium">{review.user}</h4>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-700 text-sm">{review.content}</p>
                    <div className="flex items-center gap-4 mt-6">
                      <button className="flex items-center gap-1 p-[9px] rounded-[4px] bg-[#00000008] text-gray-500">
                        <ThumbsUp className="size-[18px]" />
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 p-[9px] rounded-[4px] bg-[#00000008] text-gray-500">
                        <ThumbsDown className="size-[18px]" />
                        <span>{review.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:max-w-[400px] w-full">
          {/* Specifications Section */}
          <div className="border border-solid border-[#00000014] rounded-[8px] ">
            <div className="flex justify-between items-center border-b border-[#00000014] py-[16px] px-[16px] border-solid">
              <h2 className="text-[16px] font-medium">Specifications</h2>
              <ChevronRight className="size-[16px]"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-[16px]">
              {Object.entries(productData.specifications).map(
                ([key, value]) => (
                  <div key={key} className="flex justify-between text-[14px]  lg:flex-col  py-2">
                    <span className=" text-[#00000099] capitalize">{key}</span>
                    <span className="text-[#000000E5] font-medium">{value}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Popular Items */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Popular Items</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {popularItems.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="group">
              <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
                <div className="relative h-32 md:h-40 bg-gray-50">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm group-hover:text-brand-red">
                    {item.name}
                  </h3>
                  <p className="font-bold text-sm">{item.price}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 px-1 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
