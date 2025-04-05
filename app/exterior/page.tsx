import ProductTypePage from "@/components/products/product-type-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Exterior Accessories | Auto Store",
  description: "Browse our collection of exterior accessories for your vehicle",
}

export default function ExteriorPage() {
  return (
    <ProductTypePage
      type="Exterior Accessories"
      title="Exterior Accessories"
      description="Upgrade your vehicle's appearance with our premium exterior accessories. From chrome trims to spoilers, we have everything you need to make your car stand out on the road."
    />
  )
}

