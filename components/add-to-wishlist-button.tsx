"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { Product } from "@/types/product"

interface AddToWishlistButtonProps {
  productId: string
  product?: Product
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  className?: string
}

export default function AddToWishlistButton({
  productId,
  product,
  variant = "default",
  className,
}: AddToWishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist()
  const [isInList, setIsInList] = useState(false)

  useEffect(() => {
    setIsInList(isInWishlist(productId))
  }, [isInWishlist, productId, wishlistItems])

  const handleToggleWishlist = async () => {
    if (isInList) {
      await removeFromWishlist(productId)
    } else {
      // Find the product in the wishlist items or use the provided product
      const wishlistProduct = wishlistItems.find((item) => item.id === productId) || product
      if (wishlistProduct) {
        await addToWishlist(wishlistProduct)
      } else {
        console.error("Product not found for wishlist")
      }
    }
  }

  return (
    <Button variant={variant} onClick={handleToggleWishlist} className={cn(className)}>
      <Heart className={cn("mr-2 h-4 w-4", isInList ? "fill-current" : "")} />
      {isInList ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
