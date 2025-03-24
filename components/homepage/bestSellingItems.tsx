// components/BestSellingItems.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  categories: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Alternator',
    price: '$199.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 2,
    name: 'Differential',
    price: '$249.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 3,
    name: 'Clutch Assembly',
    price: '$179.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 4,
    name: 'Brake Discs',
    price: '$89.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 5,
    name: 'Transmission Gears',
    price: '$299.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 6,
    name: 'Crankshaft',
    price: '$399.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 7,
    name: 'Brake System',
    price: '$249.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  },
  {
    id: 8,
    name: 'Engine Assembly',
    price: '$799.99',
    image: '/images/Home page (1).png',
    categories: ['Camry', 'Interior', 'Salon']
  }
];

export default function BestSellingItems() {
  return (
    <div className="">
      <h2 className="text-[20px] md:text-[18px] tracking-[-4%] text-center lg:text-left font-medium mb-10">Best Selling Items</h2>
      
      {/* Desktop Layout - Grid with 4 columns */}
      <div className="hidden lg:grid lg:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-50 rounded-md overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-gray-800">Name of Item</h3>
              <p className="text-gray-800 mb-2">Pricing</p>
              <div className="flex space-x-2">
                {product.categories.map((category, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Layout - 2 columns per row */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-50 rounded-md overflow-hidden mb-4">
            <div className="aspect-square relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm text-gray-800">Name of Item</h3>
              <p className="text-sm text-gray-800 mb-1">Pricing</p>
              <div className="flex flex-wrap gap-1">
                {product.categories.slice(0, 2).map((category, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* See more button */}
      <div className="flex justify-center mt-8">
        <Link 
          href="/products" 
          className="bg-black text-white px-6 py-3 rounded-md flex items-center"
        >
          See more 
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}