"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/api/use-auth";

// This is specifically the mobile navigation menu
const NavMenu = ({ onClose }: { onClose?: () => void }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col max-h-screen">
      {/* Fixed Header */}
      <div className="bg-white sticky top-0 z-10">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Image
              src="/images/1000021435-removebg-preview 1.png"
              alt="Auto Store"
              width={120}
              height={40}
            />
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search product or brand..." className="pl-10" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Info (if logged in) */}
        {user && (
          <Link href="/profile" onClick={onClose}>
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Categories */}
        <div className="px-4 py-3">
          <h3 className="text-base font-medium mb-3">Categories</h3>
          <div className="space-y-4">
            <Link
              href="/category/interior"
              className="block py-4 text-gray-700 hover:text-brand-red"
              onClick={onClose}
            >
              Interior Accessories
            </Link>
            <Link
              href="/category/exterior"
              className="block py-4 text-gray-700 hover:text-brand-red"
              onClick={onClose}
            >
              Exteriors
            </Link>
          </div>
        </div>

        {/* Main Menu */}
        <div className="px-4 mt-[58px]">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <span className="text-base font-medium">Main menu</span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <Link
                href="/cart"
                className="flex items-center gap-3 py-4 text-gray-700 hover:text-brand-red"
                onClick={onClose}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>My cart</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-3 py-4 text-gray-700 hover:text-brand-red"
                onClick={onClose}
              >
                <Heart className="h-5 w-5" />
                <span>My favourites</span>
              </Link>

              {!user && (
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-3 py-4 text-gray-700 hover:text-brand-red"
                  onClick={onClose}
                >
                  <User className="h-5 w-5" />
                  <span>Register</span>
                </Link>
              )}

              <Link
                href="/support"
                className="flex items-center gap-3 py-4 text-gray-700 hover:text-brand-red"
                onClick={onClose}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Contact support</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Additional space at bottom to ensure logout is visible */}
        <div className="h-24"></div>
      </div>

      {/* Fixed Logout Footer */}
      <div className="bg-white sticky bottom-0 left-0 right-0 z-10">
        <Separator />
        <div className="px-4 py-4">
          {user ? (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-0 text-red-500 hover:text-red-700 hover:bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </Button>
          ) : (
            <Link href="/auth/login" onClick={onClose}>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 px-0 text-blue-500 hover:text-blue-700 hover:bg-transparent"
              >
                <User className="h-5 w-5" />
                <span>Log in</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
