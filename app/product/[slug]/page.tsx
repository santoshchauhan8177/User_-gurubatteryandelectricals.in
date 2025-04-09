import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchProductBySlug, fetchRelatedProducts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Share2, Star, Truck, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ProductImageGallery from "@/components/product-image-gallery"
import ProductQuantitySelector from "@/components/product-quantity-selector"
import ProductVariantSelector from "@/components/product-variant-selector"
import ProductReviews from "@/components/product-reviews"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import AddToWishlistButton from "@/components/add-to-wishlist-button"
import ProductBreadcrumb from "@/components/product-breadcrumb"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const product = await fetchProductBySlug(params.slug)

    if (!product) {
      return {
        title: "Product Not Found | ShopHub",
        description: "The requested product could not be found.",
      }
    }

    return {
      title: `${product.name} | ShopHub`,
      description: product.description.substring(0, 160),
      openGraph: {
        images: [{ url: product.images[0] || "/placeholder.svg" }],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Product | ShopHub",
      description: "View product details",
    }
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    console.log("Fetching product with slug:", params.slug)
    const product = await fetchProductBySlug(params.slug)

    if (!product) {
      console.log("Product not found, returning 404")
      notFound()
    }

    console.log("Product found:", product.name)

    // Fetch related products, but don't let it fail the page
    let relatedProducts = []
    try {
      relatedProducts = await fetchRelatedProducts(product.id, product.categoryId)
    } catch (error) {
      console.error("Error fetching related products:", error)
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ProductBreadcrumb category={product.category} productName={product.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div>
            <ProductImageGallery images={product.images} />
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              {product.discount > 0 && (
                <Badge className="mb-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
              )}

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <Link href="#reviews" className="ml-2 text-sm text-muted-foreground hover:text-primary">
                    {product.reviewCount} reviews
                  </Link>
                </div>

                <Separator orientation="vertical" className="h-5" />

                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.shortDescription}</p>
            </div>

            <div className="space-y-6 mb-6">
              {product.variants && product.variants.length > 0 && (
                <ProductVariantSelector variants={product.variants} defaultVariant={product.variants[0]} />
              )}

              <ProductQuantitySelector maxQuantity={product.stock} defaultQuantity={1} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AddToCartButton product={product} className="flex-1" disabled={product.stock === 0} />

              <AddToWishlistButton productId={product.id} product={product} variant="outline" />

              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Free shipping</p>
                  <p className="text-sm text-muted-foreground">Free standard shipping on orders over $50</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
                  {product.stock > 0 ? (
                    <p className="text-sm text-muted-foreground">Usually ships within 1-2 business days</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">This item is currently out of stock</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews" id="reviews">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications &&
                product.specifications.map((spec, index) => (
                  <div key={index} className="flex border-b pb-2">
                    <span className="font-medium w-1/3">{spec.name}:</span>
                    <span className="text-muted-foreground w-2/3">{spec.value}</span>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ProductReviews productId={product.id} />
            </Suspense>
          </TabsContent>
        </Tabs>

        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error rendering product page:", error)
    notFound()
  }
}
