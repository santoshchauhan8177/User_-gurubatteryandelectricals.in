"use client"

import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Loader2, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (productId: string) => {
    const product = wishlistItems.find((item) => item.id === productId)
    if (product) {
      addToCart(product)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add items to your wishlist to keep track of products you're interested in.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">{wishlistItems.length} items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full opacity-90 hover:opacity-100"
                onClick={() => removeFromWishlist(product.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
                <span className="sr-only">Remove from wishlist</span>
              </Button>
            </div>

            <CardContent className="p-4">
              <Link href={`/product/${product.slug}`} className="hover:text-primary">
                <h3 className="font-medium line-clamp-1 mb-1">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

              <div className="flex items-center justify-between mb-4">
                {product.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatCurrency(product.price * (1 - product.discount / 100))}</span>
                    <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                  </div>
                ) : (
                  <span className="font-bold">{formatCurrency(product.price)}</span>
                )}

                {product.stock <= 5 && product.stock > 0 ? (
                  <span className="text-xs text-amber-500">Only {product.stock} left</span>
                ) : product.stock === 0 ? (
                  <span className="text-xs text-red-500">Out of stock</span>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" asChild className="flex-shrink-0">
                  <Link href={`/product/${product.slug}`}>View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
