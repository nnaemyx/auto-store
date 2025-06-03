import ProductTypePage from "@/components/products/product-type-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Universal Products | Auto Store",
  description: "Browse our collection of universal automotive products and accessories",
}

export default function UniversalProductsPage() {
  return (
    <ProductTypePage
      type="Universal Products"
      title="Universal Products"
      description="Discover our wide range of universal automotive products. From interior accessories to exterior enhancements, we offer high-quality products that fit most vehicle makes and models."
    />
  )
} 