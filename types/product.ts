import type { Category } from "./category"
import type { Variant } from "./variant"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  discount: number
  stock: number
  sku: string
  images: string[]
  rating: number
  reviewCount: number
  categoryId: string
  category: Category
  brand: string
  variants?: Variant[]
  specifications?: {
    name: string
    value: string
  }[]
  featured?: boolean
  createdAt: string
  updatedAt: string
}
