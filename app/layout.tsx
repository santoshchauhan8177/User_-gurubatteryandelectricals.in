import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/hooks/use-wishlist"
import { NotificationsProvider } from "@/lib/hooks/use-notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " Guru battery and electricals",
  description: "Find the best products at the best prices",
   
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <WishlistProvider>
              <NotificationsProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </NotificationsProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'