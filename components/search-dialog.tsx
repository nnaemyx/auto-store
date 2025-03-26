"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const popularSearches = ["Car seats", "Alternator", "Lexus ls360 chrome rims", "Benz parts"]

const popularTags = ["Tires", "Interior", "Exterior", "Engine"]

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    onOpenChange(false)
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
        {isMobile ? (
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 ">
              <Link href="/" className="flex items-center">
                <Image src="/images/1000021435-removebg-preview 1.png" alt="Auto Store" width={88} height={33.65} />
              </Link>
              <div className="flex items-center gap-4">
                <DialogClose className="p-0 m-0">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
            </div>

            {/* Mobile Search Form */}
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

            {/* Mobile Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Popular searches</h3>
                  <div className="space-y-4">
                    {popularSearches.map((search) => (
                      <Link
                        key={search}
                        href={`/search?q=${encodeURIComponent(search)}`}
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
            </div>
          </div>
        ) : (
          // Desktop Search Dialog
          <div className="p-4 space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Auto Store"
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

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Popular searches</h3>
              <div className="space-y-2">
                {popularSearches.map((search) => (
                  <Link
                    key={search}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="block py-2 text-sm hover:text-primary"
                    onClick={() => onOpenChange(false)}
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Popular tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link key={tag} href={`/tag/${tag.toLowerCase()}`} onClick={() => onOpenChange(false)}>
                    <Badge variant="secondary" className="px-3 py-1 rounded-full">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog

