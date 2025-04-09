import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/types/category"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-square">
          <Image
            src={category.imageUrl || "/placeholder.svg?height=200&width=200"}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-3 text-center">
          <h3 className="font-medium text-sm">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
