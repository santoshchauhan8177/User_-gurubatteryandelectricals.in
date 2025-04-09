import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import type { Category } from "@/types/category"

interface ProductBreadcrumbProps {
  category?: Category
  productName: string
}

export default function ProductBreadcrumb({ category, productName }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="flex items-center hover:text-primary">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
        </li>
        <li className="flex items-center">
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={`/products?category=${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 mx-2" />
        </li>
        <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">{productName}</li>
      </ol>
    </nav>
  )
}
