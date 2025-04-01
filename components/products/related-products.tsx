// Create a separate component for related products to improve code organization

// Related Products Component
import { useProductsByCategory } from "@/hooks/use-products";
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function RelatedProducts({ categoryId, currentProductId }: { categoryId: string | number; currentProductId: number }) {
  const categoryIdNum = typeof categoryId === "string" ? Number.parseInt(categoryId) : categoryId
  const { data: products, isLoading, isError } = useProductsByCategory(categoryIdNum)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-brand-red" />
      </div>
    )
  }

  if (isError || !products) {
    return null
  }

  // Filter out the current product and limit to 4 items
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {relatedProducts.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`} className="group">
          <div className="bg-white rounded-md overflow-hidden border border-gray-200 transition-all group-hover:shadow-md">
            <div className="relative h-32 md:h-40 bg-gray-50">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[0].image
                    : "/placeholder.svg?height=200&width=200"
                }
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm group-hover:text-brand-red">{product.name}</h3>
              <p className="font-bold text-sm">₦{Number.parseInt(product.amount).toLocaleString()}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.category && (
                  <span className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">{product.category.name}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default RelatedProducts

