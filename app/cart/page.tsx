"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash2, CreditCard, ShoppingBag } from "lucide-react"
import CartItemQuantity from "@/components/cart-item-quantity"
import { formatCurrency } from "@/lib/utils"

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartShipping,
    clearCart,
  } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to checkout page
      window.location.href = "/checkout"
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedVariant?.id || "default"}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images[0] || "/placeholder.svg?height=96&width=96"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-medium">
                              <Link href={`/product/${item.slug}`} className="hover:text-primary">
                                {item.name}
                              </Link>
                            </h3>

                            {item.selectedVariant && (
                              <p className="text-sm text-muted-foreground">
                                {item.selectedVariant.name}: {item.selectedVariant.value}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                              <CartItemQuantity
                                quantity={item.quantity}
                                maxQuantity={item.stock}
                                onQuantityChange={(newQuantity) =>
                                  updateCartItemQuantity(item.id, newQuantity, item.selectedVariant?.id)
                                }
                              />

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id, item.selectedVariant?.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </div>

                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>

                            {item.discount > 0 && (
                              <div className="text-sm text-muted-foreground">
                                <span className="line-through">
                                  {formatCurrency((item.price / (1 - item.discount / 100)) * item.quantity)}
                                </span>
                                <span className="text-red-500 ml-1">({item.discount}% off)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{cartShipping === 0 ? "Free" : formatCurrency(cartShipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(cartTax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-2">We accept:</p>
            <div className="flex gap-2">
              <Image src="/placeholder.svg?height=30&width=40" alt="Visa" width={40} height={30} />
              <Image src="/placeholder.svg?height=30&width=40" alt="Mastercard" width={40} height={30} />
              <Image src="/placeholder.svg?height=30&width=40" alt="American Express" width={40} height={30} />
              <Image src="/placeholder.svg?height=30&width=40" alt="PayPal" width={40} height={30} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
