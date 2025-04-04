"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"

export default function FavouritesPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  const [favorites, setFavorites] = useState([
    {
      id: "1",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "5",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "6",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "7",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "8",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "9",
      name: "Name of Product",
      description: "Description",
      price: "40,500.00",
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">My favourites</span>
    </div>
  )

  const handleRemove = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "Item has been removed from your favorites",
    })
  }

  const handleAddToCart = (id: string) => {
    console.log(id)
    // In a real app, you would add the item to the cart
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    })
  }

  return (
    <ProfileLayout title="My favourites">
      {!isMobile && breadcrumb}

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg border p-6 text-center">
          <h2 className="text-lg font-medium mb-2">No favourites yet</h2>
          <p className="text-gray-500 mb-4">You haven&#39;t added any products to your favourites yet.</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile layout - list of favorites */}
          {isMobile && (
            <div className="space-y-4">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">Name of item</h3>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="font-bold mt-1">₦{item.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => handleRemove(item.id)}>
                        Remove
                      </Button>
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop layout - grid of favorites */}
          {!isMobile && (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-medium">Name of item</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="font-bold mt-1">₦{item.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => handleRemove(item.id)}>
                        Remove
                      </Button>
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </ProfileLayout>
  )
}

