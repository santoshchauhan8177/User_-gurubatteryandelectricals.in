"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"

interface ProductQuantitySelectorProps {
  maxQuantity: number
  defaultQuantity?: number
  onQuantityChange?: (quantity: number) => void
}

export default function ProductQuantitySelector({
  maxQuantity,
  defaultQuantity = 1,
  onQuantityChange,
}: ProductQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultQuantity)

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value)
      onQuantityChange?.(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity</Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-r-none"
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleChange}
          className="h-9 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-l-none"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
      {maxQuantity <= 5 && maxQuantity > 0 && (
        <p className="text-xs text-amber-500">Only {maxQuantity} items left in stock</p>
      )}
    </div>
  )
}
