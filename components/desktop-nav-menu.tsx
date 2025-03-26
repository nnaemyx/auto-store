import Link from "next/link";
import { ShoppingCart, Heart, User, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DesktopNavMenu = () => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="bg-white flex flex-col space-y-4">
        <Link href="/cart" className="flex items-center gap-2 px-3 py-2.5">
          <ShoppingCart className="h-4.5 w-4.5" />
          <span className="text-[15px] font-[450] tracking-[-3%]">My cart</span>
        </Link>

        <Link href="/favorites" className="flex items-center gap-2 px-3 py-2.5">
          <Heart className="h-4.5 w-4.5" />
          <span className="text-[15px] font-[450] tracking-[-3%]">
            My favourites
          </span>
        </Link>
        <Link
          href="/auth/signup"
          className="flex items-center gap-2 px-3 py-2.5"
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[15px] font-[450] tracking-[-3%]">
            Register
          </span>
        </Link>
        <Link href="/support" className="flex items-center gap-2 px-3 py-2.5">
          <HelpCircle className="h-4.5 w-4.5" />
          <span className="text-[15px] font-[450] tracking-[-3%]">
            Contact support
          </span>
        </Link>

        <Separator className="mt-20" />

        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span className="text-[15px] font-[450] tracking-[-3%]">Log Out</span>
        </Button>
      </div>
    </div>
  );
};

export default DesktopNavMenu;
