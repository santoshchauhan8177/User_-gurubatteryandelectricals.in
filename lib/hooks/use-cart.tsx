"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types/product"
import type { Variant } from "@/types/variant"

type CartItem = Product & {
  quantity: number
  selectedVariant?: Variant
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number, variant?: Variant) => void
  removeFromCart: (productId: string, variantId?: string) => void
  updateCartItemQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  cartItemsCount: number
  cartTotal: number
  cartSubtotal: number
  cartTax: number
  cartDiscount: number
  cartShipping: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // Calculate cart totals
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const cartDiscount = cartItems.reduce((total, item) => total + (item.discount / 100) * item.price * item.quantity, 0)

  // Free shipping for orders over $50
  const cartShipping = cartSubtotal > 50 ? 0 : 5.99

  // Tax calculation (assuming 8% tax rate)
  const cartTax = (cartSubtotal - cartDiscount) * 0.08

  const cartTotal = cartSubtotal - cartDiscount + cartShipping + cartTax

  // Add item to cart
  const addToCart = (product: Product, quantity = 1, variant?: Variant) => {
    setCartItems((prevItems) => {
      // Check if the item is already in the cart with the same variant
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id && (!variant ? !item.selectedVariant : item.selectedVariant?.id === variant.id),
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity, selectedVariant: variant }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: string, variantId?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === productId && (!variantId ? !item.selectedVariant : item.selectedVariant?.id === variantId)),
      ),
    )
  }

  // Update item quantity
  const updateCartItemQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && (!variantId ? !item.selectedVariant : item.selectedVariant?.id === variantId)
          ? { ...item, quantity }
          : item,
      ),
    )
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartItemsCount,
        cartTotal,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
