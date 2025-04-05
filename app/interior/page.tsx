import ProductTypePage from "@/components/products/product-type-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Interior Accessories | Auto Store",
  description: "Browse our collection of interior accessories for your vehicle",
}

export default function InteriorPage() {
  return (
    <ProductTypePage
      type="Interior Accessories"
      title="Interior Accessories"
      description="Enhance your vehicle's interior with our premium accessories. From seat covers to dashboard organizers, we have everything you need to make your car's interior more comfortable and stylish."
    />
  )
}

