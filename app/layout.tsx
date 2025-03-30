import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/api/provider"
import ClientOnly from "@/api/client-only"
import { AuthProvider } from "@/api/auth-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Auto Store - Quality Auto Parts",
  description: "Find the best auto parts for your vehicle",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientOnly>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </ClientOnly>
        </Providers>
      </body>
    </html>
  )
}

