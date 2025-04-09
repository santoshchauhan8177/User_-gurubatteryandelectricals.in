"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card
        className={cn("group overflow-hidden transition-all duration-300 h-full", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
          )}

          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleWishlist}
            >
              <Heart className={cn("h-4 w-4", isInWishlist(product.id) ? "fill-red-500 text-red-500" : "")} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>

          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2 transform transition-transform duration-300",
              isHovered ? "translate-y-0" : "translate-y-full",
            )}
          >
            <Button className="w-full" size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>

          <h3 className="font-medium line-clamp-1">{product.name}</h3>

          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{product.brand}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="font-bold">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          {product.stock <= 5 && product.stock > 0 ? (
            <span className="text-xs text-amber-500">Only {product.stock} left</span>
          ) : product.stock === 0 ? (
            <span className="text-xs text-red-500">Out of stock</span>
          ) : null}
        </CardFooter>
      </Card>
    </Link>
  )
}
