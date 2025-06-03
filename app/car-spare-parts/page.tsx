import ProductTypePage from "@/components/products/product-type-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Car Spare Parts | Auto Store",
  description: "Browse our collection of genuine car spare parts and components",
}

export default function CarSparePartsPage() {
  return (
    <ProductTypePage
      type="Car Spare Parts"
      title="Car Spare Parts"
      description="Find genuine and high-quality spare parts for your vehicle. We offer a comprehensive selection of mechanical and electrical components to keep your car running smoothly."
    />
  )
} 