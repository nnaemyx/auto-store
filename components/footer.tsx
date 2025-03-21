import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image src="/images/logo.png" alt="Auto Store" width={200} height={80} className="dark:hidden" />
            </Link>
            <p className="text-sm text-gray-600 mb-4">Your one-stop shop for quality auto parts and accessories.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-brand-red">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-brand-red">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-brand-red">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-brand-red">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-brand-red">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-brand-red">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-sm text-gray-600 hover:text-brand-red">
                  Car Brands
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-brand-red">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/interior" className="text-sm text-gray-600 hover:text-brand-red">
                  Interior Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/exterior" className="text-sm text-gray-600 hover:text-brand-red">
                  Exterior Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/engine" className="text-sm text-gray-600 hover:text-brand-red">
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link href="/category/tires" className="text-sm text-gray-600 hover:text-brand-red">
                  Tires & Wheels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6">Contact Us</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-600 mb-2">123 Auto Avenue</p>
              <p className="text-sm text-gray-600 mb-2">Auto City, AU 12345</p>
              <p className="text-sm text-gray-600 mb-2">Email: info@autostore.com</p>
              <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600">Copyright 2025 Auto Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

