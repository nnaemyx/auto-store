import Link from "next/link"
import { ShoppingCart, Heart, User, LogOut, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"

// This is the desktop navigation menu that appears in the sheet
const DesktopNavMenu = () => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>
      <div className="mt-6 flex flex-col gap-4">
        <Link href="/cart" className="flex items-center gap-3 px-2 py-1">
          <ShoppingCart className="h-5 w-5" />
          <span>My cart</span>
        </Link>

        <Link href="/favorites" className="flex items-center gap-3 px-2 py-1">
          <Heart className="h-5 w-5" />
          <span>My favourites</span>
        </Link>

        <Link href="/profile" className="flex items-center gap-3 px-2 py-1">
          <User className="h-5 w-5" />
          <span>My profile</span>
        </Link>

        <Link href="/support" className="flex items-center gap-3 px-2 py-1">
          <HelpCircle className="h-5 w-5" />
          <span>Contact support</span>
        </Link>

        <Separator className="my-2" />

        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </>
  )
}

export default DesktopNavMenu

