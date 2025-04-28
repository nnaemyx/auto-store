"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useProducts } from "@/hooks/use-products"
import { useRouter } from "next/navigation"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const popularSearches = ["Car seats", "Alternator", "Lexus ls360 chrome rims", "Benz parts"]
const popularTags = ["Tires", "Interior", "Exterior", "Engine"]

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  // Fetch products based on search query
  const { data: products, isLoading } = useProducts({
    search: searchQuery,
    limit: 5 // Limit results in search dialog
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onOpenChange(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search</DialogTitle>
      <DialogContent
        className={cn("p-0", isMobile ? "h-full max-h-screen w-full m-0 rounded-none border-0" : "sm:max-w-[600px]")}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center">
              <Image src="/images/1000021435-removebg-preview 1.png" alt="Auto Store" width={88} height={33.65} />
            </Link>
            <div className="flex items-center gap-4">
              <DialogClose className="p-0 m-0">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
          </div>

          {/* Search Form */}
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Auto Store..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="p-4 border-t">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : products && products.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Search Results</h3>
                  <div className="space-y-2">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="block p-2 hover:bg-gray-50 rounded-md"
                        onClick={() => onOpenChange(false)}
                      >
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <div className="w-10 h-10 relative rounded-md overflow-hidden">
                              <Image
                                src={product.images[0].image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">₦{product.amount}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No results found</p>
              )}
            </div>
          )}

          {/* Popular Searches and Tags */}
          {!searchQuery && (
            <div className="space-y-6 p-4">
              <div>
                <h3 className="text-base font-medium mb-4">Popular searches</h3>
                <div className="space-y-4">
                  {popularSearches.map((search) => (
                    <Link
                      key={search}
                      href={`/products?search=${encodeURIComponent(search)}`}
                      className="block text-gray-700 hover:text-brand-red"
                      onClick={() => onOpenChange(false)}
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Popular tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link key={tag} href={`/tag/${tag.toLowerCase()}`} onClick={() => onOpenChange(false)}>
                      <Badge
                        variant="secondary"
                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog

