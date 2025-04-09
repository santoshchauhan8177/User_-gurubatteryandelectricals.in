"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Variant } from "@/types/variant"

interface ProductVariantSelectorProps {
  variants: Variant[]
  defaultVariant?: Variant
  onVariantChange?: (variant: Variant) => void
}

export default function ProductVariantSelector({
  variants,
  defaultVariant,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(defaultVariant)

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId)
    setSelectedVariant(variant)
    if (variant) {
      onVariantChange?.(variant)
    }
  }

  // Group variants by name (e.g., "Color", "Size")
  const variantGroups = variants.reduce<Record<string, Variant[]>>((groups, variant) => {
    const name = variant.name
    if (!groups[name]) {
      groups[name] = []
    }
    groups[name].push(variant)
    return groups
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
        <div key={groupName} className="space-y-2">
          <Label htmlFor={`variant-${groupName}`}>{groupName}</Label>
          <RadioGroup
            id={`variant-${groupName}`}
            value={selectedVariant?.id}
            onValueChange={handleVariantChange}
            className="flex flex-wrap gap-2"
          >
            {groupVariants.map((variant) => (
              <div key={variant.id} className="flex items-center">
                <RadioGroupItem id={variant.id} value={variant.id} className="peer sr-only" />
                <Label
                  htmlFor={variant.id}
                  className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {variant.value}
                  {variant.price && variant.price > 0 && ` (+$${variant.price.toFixed(2)})`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )
}
