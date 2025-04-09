import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchProducts, fetchCategories } from "@/lib/api"
import ProductsGrid from "@/components/products-grid"
import ProductsFilters from "@/components/products-filters"
import ProductsSorting from "@/components/products-sorting"
import ProductsViewToggle from "@/components/products-view-toggle"
import ProductsPagination from "@/components/products-pagination"
import ProductsLoading from "@/components/products-loading"
import { Button } from "@/components/ui/button"
import { Filter, SlidersHorizontal, AlertCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Products | ShopHub",
  description: "Browse our collection of products",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "popular"
  const view = typeof searchParams.view === "string" ? searchParams.view : "grid"
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseFloat(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseFloat(searchParams.maxPrice) : undefined
  const onSale = searchParams.on_sale === "true"
  const inStock = searchParams.in_stock === "true"

  // Fetch data with error handling
  let categories = []
  let products = []
  let totalProducts = 0
  let totalPages = 1
  let error = null

  try {
    categories = await fetchCategories()
  } catch (err) {
    console.error("Error fetching categories:", err)
    categories = []
  }

  try {
    console.log("Fetching products with params:", { page, sort, category, minPrice, maxPrice, onSale, inStock })
    const productsData = await fetchProducts({
      page,
      sort,
      category,
      minPrice,
      maxPrice,
      onSale,
      inStock,
    })

    products = productsData.products || []
    totalProducts = productsData.totalProducts || 0
    totalPages = productsData.totalPages || 1

    console.log(`Fetched ${products.length} products out of ${totalProducts} total`)
  } catch (err) {
    console.error("Error fetching products:", err)
    error = "Failed to load products. Please try again later."
    products = []
    totalProducts = 0
    totalPages = 1
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <ProductsFilters
                  categories={categories}
                  selectedCategory={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onSale={onSale}
                  inStock={inStock}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 ml-auto">
            <ProductsViewToggle view={view} />
            <ProductsSorting sort={sort} />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="hidden md:block">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </h2>
            <ProductsFilters
              categories={categories}
              selectedCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onSale={onSale}
              inStock={inStock}
            />
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-4">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsGrid products={products} view={view} />

            {products.length > 0 && (
              <div className="mt-8">
                <ProductsPagination currentPage={page} totalPages={totalPages} totalItems={totalProducts} />
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
