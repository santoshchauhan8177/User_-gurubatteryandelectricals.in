// This file contains functions to interact with the backend API

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = "An error occurred while fetching data"

    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // If the error response is not valid JSON, use the text as the message
      if (errorText) {
        errorMessage = errorText
      }
    }

    throw new Error(errorMessage)
  }
  return response.json()
}

// Mock data for development (will be replaced by actual API calls)
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: `<p>This is a detailed description for Product ${i + 1}. It includes all the features and benefits of the product.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  shortDescription: `Short description for Product ${i + 1}`,
  price: 49.99 + i * 10,
  discount: i % 3 === 0 ? 10 : 0,
  stock: i % 5 === 0 ? 0 : 20,
  sku: `SKU-${1000 + i}`,
  images: [
    `/placeholder.svg?height=600&width=600&text=Product+${i + 1}`,
    `/placeholder.svg?height=600&width=600&text=Image+2`,
    `/placeholder.svg?height=600&width=600&text=Image+3`,
  ],
  rating: 3 + (i % 3),
  reviewCount: 10 + i,
  categoryId: `category-${(i % 6) + 1}`,
  category: {
    id: `category-${(i % 6) + 1}`,
    name: `Category ${(i % 6) + 1}`,
    slug: `category-${(i % 6) + 1}`,
  },
  brand: `Brand ${(i % 4) + 1}`,
  variants:
    i % 2 === 0
      ? [
          { id: `variant-${i}-1`, name: "Color", value: "Red" },
          { id: `variant-${i}-2`, name: "Color", value: "Blue" },
          { id: `variant-${i}-3`, name: "Size", value: "Small" },
          { id: `variant-${i}-4`, name: "Size", value: "Medium" },
          { id: `variant-${i}-5`, name: "Size", value: "Large" },
        ]
      : undefined,
  specifications: [
    { name: "Material", value: "Premium Quality" },
    { name: "Dimensions", value: "10 x 20 x 5 cm" },
    { name: "Weight", value: "500g" },
  ],
  featured: i < 8,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
}))

const mockCategories = Array.from({ length: 6 }, (_, i) => ({
  id: `category-${i + 1}`,
  name: `Category ${i + 1}`,
  slug: `category-${i + 1}`,
  description: `Description for Category ${i + 1}`,
  imageUrl: `/placeholder.svg?height=200&width=200&text=Category+${i + 1}`,
}))

const mockBanners = [
  {
    id: "banner-1",
    title: "Summer Collection",
    subtitle: "Discover the latest trends",
    imageUrl: "/placeholder.svg?height=600&width=1200&text=Summer+Collection",
    link: "/products?category=summer",
  },
  {
    id: "banner-2",
    title: "Men's Collection",
    subtitle: "Style for every occasion",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Men's+Collection",
    link: "/products?category=men",
  },
  {
    id: "banner-3",
    title: "Women's Collection",
    subtitle: "Elegance and comfort",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Women's+Collection",
    link: "/products?category=women",
  },
]

// Fetch featured products for the homepage
export async function fetchFeaturedProducts() {
  // For development or when API is not available, return mock data
  if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
    console.log("Using mock data for featured products")
    return mockProducts.filter((p) => p.featured).slice(0, 8)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products?featured=true&limit=8`, {
      next: { revalidate: 3600 },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    // Fall back to mock data on error
    console.log("Falling back to mock data for featured products")
    return mockProducts.filter((p) => p.featured).slice(0, 8)
  }
}

// Fetch product categories
export async function fetchCategories() {
  // For development or when API is not available, return mock data
  if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
    console.log("Using mock data for categories")
    return mockCategories
  }

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Fall back to mock data on error
    console.log("Falling back to mock data for categories")
    return mockCategories
  }
}

// Fetch banners for the homepage
export async function fetchBanners() {
  // For development or when API is not available, return mock data
  if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
    console.log("Using mock data for banners")
    return mockBanners
  }

  try {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching banners:", error)
    // Fall back to mock data on error
    console.log("Falling back to mock data for banners")
    return mockBanners
  }
}

// Fetch products with filtering and pagination
export async function fetchProducts({
  page = 1,
  limit = 12,
  sort = "popular",
  category,
  minPrice,
  maxPrice,
  onSale,
  inStock,
  search,
}: {
  page?: number
  limit?: number
  sort?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  inStock?: boolean
  search?: string
}) {
  // For development or when API is not available, return mock data with filtering
  if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
    console.log("Using mock data for products")
    let filteredProducts = [...mockProducts]

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category.slug === category)
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice)
    }

    if (onSale) {
      filteredProducts = filteredProducts.filter((p) => p.discount > 0)
    }

    if (inStock) {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      // Default is 'popular'
      default:
        filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      totalProducts: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
    }
  }

  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    })

    if (category) params.append("category", category)
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString())
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString())
    if (onSale) params.append("onSale", "true")
    if (inStock) params.append("inStock", "true")
    if (search) params.append("search", search)

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000), // Add timeout to prevent hanging requests
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching products:", error)

    // Fall back to mock data on error
    console.log("Falling back to mock data for products")
    let filteredProducts = [...mockProducts]

    // Apply the same filtering logic as above
    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category.slug === category)
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice)
    }

    if (onSale) {
      filteredProducts = filteredProducts.filter((p) => p.discount > 0)
    }

    if (inStock) {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      // Default is 'popular'
      default:
        filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      totalProducts: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
    }
  }
}

// Fetch a single product by slug
export async function fetchProductBySlug(slug: string) {
  console.log("API: Fetching product with slug:", slug)

  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
      console.log("API: Using mock data for product")
      const product = mockProducts.find((p) => p.slug === slug)

      if (!product) {
        console.log("API: Product not found in mock data")
        return null
      }

      console.log("API: Found product in mock data:", product.name)
      return product
    }

    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000), // Add timeout to prevent hanging requests
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log("API: Product not found in API")
        return null
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
    }

    return handleResponse(response)
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error)

    // If API fails, try to return from mock data as fallback
    if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
      console.log("API: Falling back to mock data after error")
      const product = mockProducts.find((p) => p.slug === slug)
      return product || null
    }

    return null
  }
}

// Fetch related products
export async function fetchRelatedProducts(productId: string, categoryId: string) {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return mockProducts.filter((p) => p.id !== productId && p.categoryId === categoryId).slice(0, 4)
    }

    const response = await fetch(
      `${API_BASE_URL}/products/related?productId=${productId}&categoryId=${categoryId}&limit=4`,
      { next: { revalidate: 300 } },
    )
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

// Fetch product reviews
export async function fetchProductReviews(productId: string, page = 1, limit = 5) {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const mockReviews = Array.from({ length: 8 }, (_, i) => ({
        id: `review-${productId}-${i}`,
        productId,
        rating: 3 + (i % 3),
        title: `Great product ${i + 1}`,
        comment: `This is a review for product ${productId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Review number ${i + 1}.`,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        helpfulCount: i * 2,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      }))

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedReviews = mockReviews.slice(startIndex, endIndex)

      return {
        reviews: paginatedReviews,
        totalReviews: mockReviews.length,
        totalPages: Math.ceil(mockReviews.length / limit),
      }
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`, {
      next: { revalidate: 300 },
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching product reviews:", error)
    return { reviews: [], totalReviews: 0, totalPages: 0 }
  }
}

// Submit a product review
export async function submitProductReview(productId: string, reviewData: any) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Submitting review:", { productId, reviewData })
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error submitting product review:", error)
    throw error
  }
}

// Fetch user data
export async function fetchUserData() {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        avatarUrl: null,
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        lastLoginAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        orderCount: 5,
      }
    }

    const response = await fetch(`${API_BASE_URL}/user`, {
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// User login
export async function loginUser(credentials: { email: string; password: string }) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Login attempt:", credentials)
      if (credentials.email === "test@example.com" && credentials.password === "password") {
        return { success: true, user: { id: "user-1", name: "Test User" } }
      }
      throw new Error("Invalid credentials")
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

// User registration
export async function registerUser(userData: any) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Registering user:", userData)
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// User logout
export async function logoutUser() {
  try {
    // For development, just log the action
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Logging out user")
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

// Fetch user orders
export async function fetchUserOrders(page = 1, limit = 10) {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const mockOrders = Array.from({ length: 5 }, (_, i) => ({
        id: `order-${i + 1}`,
        orderNumber: `ORD-${10000 + i}`,
        status: ["processing", "shipped", "delivered", "cancelled"][i % 4],
        total: 99.99 + i * 50,
        items: Array.from({ length: 2 + (i % 3) }, (_, j) => ({
          id: `item-${i}-${j}`,
          productId: `product-${j + 1}`,
          productName: `Product ${j + 1}`,
          price: 29.99 + j * 10,
          quantity: 1 + (j % 2),
          image: `/placeholder.svg?height=80&width=80&text=Product+${j + 1}`,
        })),
        createdAt: new Date(Date.now() - i * 7 * 86400000).toISOString(),
      }))

      return {
        orders: mockOrders,
        totalOrders: mockOrders.length,
        totalPages: 1,
      }
    }

    const response = await fetch(`${API_BASE_URL}/user/orders?page=${page}&limit=${limit}`, { credentials: "include" })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return { orders: [], totalOrders: 0, totalPages: 0 }
  }
}

// Fetch a single order by ID
export async function fetchOrderById(orderId: string) {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const mockOrder = {
        id: orderId,
        orderNumber: `ORD-${10000 + Number.parseInt(orderId.split("-")[1])}`,
        status: ["processing", "shipped", "delivered", "cancelled"][Number.parseInt(orderId.split("-")[1]) % 4],
        total: 99.99 + Number.parseInt(orderId.split("-")[1]) * 50,
        subtotal: 89.99 + Number.parseInt(orderId.split("-")[1]) * 50,
        tax: 8.99,
        shipping: 0,
        discount: 0,
        items: Array.from({ length: 2 + (Number.parseInt(orderId.split("-")[1]) % 3) }, (_, j) => ({
          id: `item-${orderId}-${j}`,
          productId: `product-${j + 1}`,
          productName: `Product ${j + 1}`,
          price: 29.99 + j * 10,
          quantity: 1 + (j % 2),
          image: `/placeholder.svg?height=80&width=80&text=Product+${j + 1}`,
        })),
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address1: "123 Main St",
          address2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
          phone: "+1 (555) 123-4567",
        },
        billingAddress: {
          firstName: "John",
          lastName: "Doe",
          address1: "123 Main St",
          address2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
          phone: "+1 (555) 123-4567",
        },
        paymentMethod: "Credit Card",
        createdAt: new Date(Date.now() - Number.parseInt(orderId.split("-")[1]) * 7 * 86400000).toISOString(),
      }

      return mockOrder
    }

    const response = await fetch(`${API_BASE_URL}/user/orders/${orderId}`, {
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error)
    return null
  }
}

// Create a new order
export async function createOrder(orderData: any) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Creating order:", orderData)
      return {
        success: true,
        orderId: "order-new",
        orderNumber: "ORD-12345",
      }
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Fetch user wishlist
export async function fetchWishlist() {
  try {
    // For development, return mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return mockProducts.slice(0, 4)
    }

    const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }
}

// Add product to wishlist
export async function addToWishlist(productId: string) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Adding to wishlist:", productId)
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Removing from wishlist:", productId)
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/user/wishlist/${productId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

// Fetch user notifications
export async function fetchNotifications(page = 1, limit = 10) {
  // For development or when API is not available, return mock data
  if (!process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development") {
    console.log("Using mock data for notifications")
    const mockNotifications = Array.from({ length: 8 }, (_, i) => ({
      id: `notification-${i + 1}`,
      title: `Notification ${i + 1}`,
      message: `This is notification message ${i + 1}. Lorem ipsum dolor sit amet.`,
      type: ["order", "product", "system", "promotion"][i % 4],
      read: i < 3 ? false : true,
      link: i % 2 === 0 ? `/order/order-${i + 1}` : null,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = mockNotifications.slice(startIndex, endIndex)

    return {
      notifications: paginatedNotifications,
      totalNotifications: mockNotifications.length,
      totalPages: Math.ceil(mockNotifications.length / limit),
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/notifications?page=${page}&limit=${limit}`, {
      credentials: "include",
      signal: AbortSignal.timeout(5000), // Add timeout to prevent hanging requests
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching notifications:", error)

    // Fall back to mock data on error
    console.log("Falling back to mock data for notifications")
    const mockNotifications = Array.from({ length: 8 }, (_, i) => ({
      id: `notification-${i + 1}`,
      title: `Notification ${i + 1}`,
      message: `This is notification message ${i + 1}. Lorem ipsum dolor sit amet.`,
      type: ["order", "product", "system", "promotion"][i % 4],
      read: i < 3 ? false : true,
      link: i % 2 === 0 ? `/order/order-${i + 1}` : null,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = mockNotifications.slice(startIndex, endIndex)

    return {
      notifications: paginatedNotifications,
      totalNotifications: mockNotifications.length,
      totalPages: Math.ceil(mockNotifications.length / limit),
    }
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Marking notification as read:", notificationId)
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/user/notifications/${notificationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(profileData: any) {
  try {
    // For development, just log the data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log("Updating user profile:", profileData)
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
      credentials: "include",
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
