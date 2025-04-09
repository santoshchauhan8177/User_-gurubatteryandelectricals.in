import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Package, Settings, User, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Account | ShopHub",
  description: "Manage your account settings and preferences.",
}

interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <Card className="p-4">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold">My Account</h2>
              <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <nav className="space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </Link>
              <Link
                href="/account/address"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <MapPin className="h-4 w-4" />
                <span>Addresses</span>
              </Link>
              <Link
                href="/account/payments"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <CreditCard className="h-4 w-4" />
                <span>Payment Methods</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>

            <Separator className="my-4" />

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Quick Links</h3>
              <nav className="space-y-1">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span>My Wishlist</span>
                </Link>
                <Link
                  href="/track-order"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/return"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span>Returns & Exchanges</span>
                </Link>
              </nav>
            </div>
          </Card>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
