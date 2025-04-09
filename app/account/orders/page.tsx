"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchUserOrders } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Loader2, Package, RefreshCw, Truck } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      try {
        const result = await fetchUserOrders(currentPage)
        setOrders(result.orders || [])
        setTotalPages(result.totalPages || 1)
      } catch (err) {
        console.error("Error loading orders:", err)
        setError("Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [currentPage])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-green-500" />
      case "delivered":
        return <Package className="h-4 w-4 text-green-700" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="border-green-700 text-green-700">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>View and manage your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">{getStatusBadge(order.status)}</div>
                </div>

                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground">+{order.items.length - 2} more items</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t">
                  <div>
                    <p className="font-medium">Total: {formatCurrency(order.total)}</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/track-order?id=${order.id}`}>
                        <Truck className="h-4 w-4 mr-2" />
                        Track
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/order/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Other tabs would filter the orders by status */}
          <TabsContent value="processing" className="space-y-4">
            {orders
              .filter((order) => order.status.toLowerCase() === "processing")
              .map((order) => (
                /* Same order card as above, filtered by status */
                <div key={order.id} className="border rounded-lg p-4">
                  {/* Order content same as above */}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="shipped" className="space-y-4">
            {orders
              .filter((order) => order.status.toLowerCase() === "shipped")
              .map((order) => (
                /* Same order card as above, filtered by status */
                <div key={order.id} className="border rounded-lg p-4">
                  {/* Order content same as above */}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {orders
              .filter((order) => order.status.toLowerCase() === "delivered")
              .map((order) => (
                /* Same order card as above, filtered by status */
                <div key={order.id} className="border rounded-lg p-4">
                  {/* Order content same as above */}
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
