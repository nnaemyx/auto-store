"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import NavMenu from "@/components/nav-menu";
import SearchDialog from "@/components/search-dialog";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="flex items-center w-full justify-between px-5 md:px-5">
        <div className="flex items-center gap-6 py-[13.18px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/1000021435-removebg-preview 1.png"
              alt="Auto Store"
              width={88}
              height={33.65}
              priority
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center justify-center text-center gap-3">
          <Link
            href="/brands"
            className={`text-sm font-[400] px-[8px] py-[21.5px] tracking-[-2.5%] transition-colors hover:text-primary ${
              pathname.includes("/brands")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Car Brands
          </Link>
          <Link
            href="/interior"
            className={`text-sm font-[400] px-[8px] py-[21.5px] tracking-[-2.5%] transition-colors hover:text-primary ${
              pathname.includes("/interior")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Interior Accessories
          </Link>
          <Link
            href="/exterior"
            className={`text-sm font-[400] px-[8px] py-[21.5px] tracking-[-2.5%] transition-colors hover:text-primary ${
              pathname.includes("/exterior")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Exterior Accessories
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-brand-red text-white"
                variant="outline"
              >
                0
              </Badge>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-[18px] font-medium">Menu</SheetTitle>
              </SheetHeader>
              <NavMenu />
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="hidden md:flex">
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <NavMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  );
};

export default Header;
