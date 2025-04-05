"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProfileLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function ProfileLayout({ children, title }: ProfileLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const navItems = [
    { label: "Profile overview", href: "/profile" },
    { label: "My favourites", href: "/profile/favourites" },
    { label: "Order history", href: "/profile/orders" },
    { label: "Returned orders", href: "/profile/returns" },
    { label: "Track order", href: "/profile/track-order" },
    { label: "Terms of agreement", href: "/profile/terms" },
    { label: "Contact support", href: "/profile/support" },
  ]

  // For mobile view with back button
  if (isMobile && pathname !== "/profile") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium">{title || "User profile"}</h1>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    )
  }

  // For mobile profile home
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white py-4 px-4">
          <h1 className="text-lg font-medium">User profile</h1>
        </div>
        <div className="p-4">
          <nav className="space-y-4" >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block py-3 border-b border-gray-200">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    )
  }

  // Desktop layout with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-3 px-4 rounded-md",
                  pathname === item.href ? "bg-gray-200 font-medium" : "hover:bg-gray-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

