import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Star, TrendingUp, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import { fetchFeaturedProducts, fetchCategories, fetchBanners } from "@/lib/api"

export default async function Home() {
  // Fetch data from your backend with error handling
  let featuredProducts = []
  let categories = []
  let banners = []

  try {
    featuredProducts = await fetchFeaturedProducts()
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    featuredProducts = []
  }

  try {
    categories = await fetchCategories()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    categories = []
  }

  try {
    banners = await fetchBanners()
  } catch (error) {
    console.error("Failed to fetch banners:", error)
    banners = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <Image
          src={banners[0]?.imageUrl || "/placeholder.svg?height=600&width=1200"}
          alt="Shop the latest trends"
          width={1200}
          height={600}
          className="w-full h-[500px] object-cover"
          priority
        />
        <div className="absolute top-1/2 left-12 transform -translate-y-1/2 z-20 max-w-lg text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Collection 2025</h1>
          <p className="text-lg mb-6 opacity-90">Discover the latest trends and styles for the upcoming season</p>
          <Button size="lg" asChild>
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Link href="/products" className="text-primary flex items-center hover:underline">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-primary flex items-center hover:underline">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Secondary Banner */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10" />
          <Image
            src={banners[1]?.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt="Men's Collection"
            width={600}
            height={400}
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <h3 className="text-2xl font-bold text-white mb-2">Men's Collection</h3>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              Shop Now
            </Button>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10" />
          <Image
            src={banners[2]?.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt="Women's Collection"
            width={600}
            height={400}
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <h3 className="text-2xl font-bold text-white mb-2">Women's Collection</h3>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
            <p className="text-muted-foreground">On all orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
            <p className="text-muted-foreground">30-day return policy</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Top Quality</h3>
            <p className="text-muted-foreground">Certified premium products</p>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Hot items this week</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted rounded-xl p-8 md:p-12 mb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
