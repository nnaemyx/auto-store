import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import BrandSlider from "@/components/brand-slider"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col px-[12px] min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Car Brands */}
      <section className="md:py-20 py-25 md:px-10 px-4">
        
          <BrandSlider />
       
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-10">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Best selling items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link href="/category/engine-parts" className="group">
              <Card className="overflow-hidden transition-all border-none">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src="/images/Home page (1).png"
                      alt="Engine Parts"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Engine Parts</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/category/brakes" className="group">
              <Card className="overflow-hidden transition-all border-none">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image src="/placeholder.svg?height=200&width=200" alt="Brakes" fill className="object-cover p-4" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Brakes</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/category/suspension" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md group-hover:border-brand-red">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Suspension"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Suspension</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/category/exterior" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md group-hover:border-brand-red">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Exterior"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Exterior</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/category/interior" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md group-hover:border-brand-red">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Interior"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Interior</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/category/filters" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md group-hover:border-brand-red">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Filters"
                      fill
                      className="object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">Filters</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

