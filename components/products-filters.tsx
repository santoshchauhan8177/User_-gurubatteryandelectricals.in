"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import type { Category } from "@/types/category"

interface ProductsFiltersProps {
  categories: Category[]
  selectedCategory?: string
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  inStock?: boolean
}

export default function ProductsFilters({
  categories,
  selectedCategory,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  onSale: initialOnSale,
  inStock: initialInStock,
}: ProductsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice || 0, initialMaxPrice || 1000])

  // Checkbox states
  const [onSale, setOnSale] = useState(initialOnSale || false)
  const [inStock, setInStock] = useState(initialInStock || false)

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search)

    // Update category
    if (selectedCategory) {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }

    // Update price range
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 1000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    // Update checkboxes
    if (onSale) {
      params.set("on_sale", "true")
    } else {
      params.delete("on_sale")
    }

    if (inStock) {
      params.set("in_stock", "true")
    } else {
      params.delete("in_stock")
    }

    // Preserve page and sort if they exist
    const page = params.get("page")
    if (!page || page === "1") {
      params.delete("page")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 1000])
    setOnSale(false)
    setInStock(false)
    router.push(pathname)
  }

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(window.location.search)

    if (selectedCategory === categorySlug) {
      params.delete("category")
    } else {
      params.set("category", categorySlug)
    }

    // Reset to page 1 when changing category
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <button
                className={`text-sm hover:text-primary ${
                  selectedCategory === category.slug ? "font-medium text-primary" : "text-muted-foreground"
                }`}
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={priceRange}
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-6"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">${priceRange[0]}</span>
          <span className="text-sm">${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium mb-2">Filter By</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="on-sale" checked={onSale} onCheckedChange={(checked) => setOnSale(!!checked)} />
          <Label htmlFor="on-sale">On Sale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="in-stock" checked={inStock} onCheckedChange={(checked) => setInStock(!!checked)} />
          <Label htmlFor="in-stock">In Stock</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
