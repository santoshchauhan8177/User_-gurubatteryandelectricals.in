"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import type { Product } from "@/types/product"
import { PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductsGridProps {
  products: Product[]
  view?: "grid" | "list"
}

export default function ProductsGrid({ products, view = "grid" }: ProductsGridProps) {
  const [mounted, setMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <PackageOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria.</p>
        <Button asChild>
          <Link href="/">Browse Featured Products</Link>
        </Button>
      </div>
    )
  }

  if (view === "list" && isDesktop) {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 relative">
                <ProductCard product={product} className="h-full border-0 rounded-none" />
              </div>
              <div className="p-6 md:w-3/4">
                <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.shortDescription}</p>
                <div className="flex items-center gap-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="font-bold text-lg">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      <span className="text-red-500">({product.discount}% off)</span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
