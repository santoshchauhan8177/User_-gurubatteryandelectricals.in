"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/hooks/use-cart"
import type { Product } from "@/types/product"
import type { Variant } from "@/types/variant"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variant?: Variant
  className?: string
  disabled?: boolean
}

export default function AddToCartButton({
  product,
  quantity = 1,
  variant,
  className,
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, quantity, variant)
    setIsAdded(true)

    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button onClick={handleAddToCart} className={cn(className)} disabled={disabled || isAdded}>
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
