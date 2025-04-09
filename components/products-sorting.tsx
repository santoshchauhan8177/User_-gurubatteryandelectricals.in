"use client"

import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductsSortingProps {
  sort?: string
}

export default function ProductsSorting({ sort = "popular" }: ProductsSortingProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set("sort", value)

    // Reset to page 1 when changing sort
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select defaultValue={sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="popular">Most Popular</SelectItem>
        <SelectItem value="newest">Newest Arrivals</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
      </SelectContent>
    </Select>
  )
}
