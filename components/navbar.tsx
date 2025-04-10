"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, Search, ShoppingCart, User, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { ModeToggle } from "./mode-toggle"

const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/products?view=categories" },
  { name: "Deals", href: "/products?on_sale=true" },
  { name: "New Arrivals", href: "/products?sort=newest" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Use the context hooks safely with error handling
  const cart = useCart()
  const wishlist = useWishlist()

  // Initialize notifications outside the try-catch to avoid conditional hook call
  let notifications
  try {
    notifications = useNotifications()
  } catch (error) {
    console.error("Error using notifications:", error)
    notifications = { unreadCount: 0 } // Provide a fallback object
  }

  const notificationsCount = notifications?.unreadCount || 0

  const cartItemsCount = cart.cartItemsCount
  const wishlistItemsCount = wishlist.wishlistItemsCount

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="font-bold text-xl">
                  Guru
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              {mainNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
              <div className="border-t my-4 pt-4">
                <div className="flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <User className="h-5 w-5" />
                      <span>Account</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/wishlist" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart</span>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="ml-4 md:ml-0 flex items-center gap-2">
          <span className="font-bold text-xl hidden md:inline-block">Guru</span>
          <span className="font-bold text-xl md:hidden">GU</span>
        </Link>

        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-auto gap-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Search products..." className="w-full md:w-[200px] lg:w-[300px]" />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ModeToggle />

          <Link href="/notifications" className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {notificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {notificationsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/wishlist" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
              {wishlistItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {wishlistItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
