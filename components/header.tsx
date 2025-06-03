"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ShoppingCart, Search, Menu, Phone} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import NavMenu from "@/components/nav-menu"
import DesktopNavMenu from "@/components/desktop-nav-menu"
import SearchDialog from "@/components/search-dialog"
import { useAuth } from "@/api/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/hooks/use-cart"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const { cart } = useCart()

   // Calculate the total number of items in the cart
   const cartItemCount = cart?.cart_items?.reduce((total, item) => total + Number.parseInt(item.quantity || "0"), 0) || 0

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  // Get first letter of username for avatar
  const getUserInitial = () => {
    return user?.username ? user.username.charAt(0).toUpperCase() : 'U'
  }

  const handleSearchClick = () => {
    setShowSearch(true)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between w-full px-5">
        <div className="flex items-center gap-6 py-[13.18px]">
          <Link href="/" className="flex items-center">
            <Image src="/images/1000021435-removebg-preview 1.png" alt="Auto Store" width={88} height={33.65} priority />
          </Link>

        </div>
        <nav className="hidden lg:flex items-center justify-center gap-6">
          <Link
            href="/brands"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.includes("/brands") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Brands
          </Link>
          <Link
            href="/universal-products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.includes("/universal-products") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Universal Products
          </Link>
          <Link
            href="/car-spare-parts"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.includes("/car-spare-parts") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Car Spare Parts
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.includes("/about") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/maintenance"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.includes("/maintenance") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Vehicle Maintenance
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-4">
            <a href="tel:+2349039756266" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                <Phone className="h-5 w-5" />
              </Button>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Call to order</p>
                <p className="text-sm text-gray-600">09039756266</p>
              </div>
            </a>
            <Button variant="ghost" size="icon" onClick={handleSearchClick}>
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-800 text-white"
                    variant="outline"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-8 w-[44px]" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full h-full overflow-hidden">
              <NavMenu onClose={handleCloseMenu} />
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <Sheet>
            <SheetTrigger asChild>
              {user ? (
                <Button variant="outline" className="hidden lg:flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                    <AvatarImage 
                      src={user.image} 
                      alt="user profile"
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                </Button>
              ) : (
                <Button variant="outline" className="hidden lg:flex">
                  Menu
                </Button>
              )}
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{user ? `Hello, ${user.username}` : 'Menu'}</SheetTitle>
              </SheetHeader>
              <DesktopNavMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  )
}

export default Header