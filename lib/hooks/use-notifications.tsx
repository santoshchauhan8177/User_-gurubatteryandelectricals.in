"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchNotifications, markNotificationAsRead } from "@/lib/api"
import type { Notification } from "@/types/notification"

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  notificationsCount: number
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  isLoading: boolean
  error: string | null
}

// Mock notifications for fallback
const mockNotifications: Notification[] = Array.from({ length: 8 }, (_, i) => ({
  id: `notification-${i + 1}`,
  title: `Notification ${i + 1}`,
  message: `This is notification message ${i + 1}. Lorem ipsum dolor sit amet.`,
  type: ["order", "product", "system", "promotion"][i % 4] as "order" | "product" | "system" | "promotion",
  read: i < 3 ? false : true,
  link: i % 2 === 0 ? `/order/order-${i + 1}` : undefined,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      if (isInitialized) return // Prevent multiple initializations

      setIsLoading(true)
      setError(null)

      try {
        // Try to fetch from API
        const result = await fetchNotifications()
        if (result && result.notifications) {
          setNotifications(result.notifications)
        } else {
          // If API returns empty or undefined, use mock data
          console.log("API returned empty notifications, using mock data")
          setNotifications(mockNotifications)
        }
      } catch (err) {
        console.error("Error loading notifications:", err)
        setError("Failed to load notifications")

        // Fall back to mock data on error
        console.log("Falling back to mock notifications data")
        setNotifications(mockNotifications)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    loadNotifications()

    // Set up polling for new notifications every 5 minutes
    // Only if we're in a browser environment
    let intervalId: NodeJS.Timeout | undefined
    if (typeof window !== "undefined") {
      intervalId = setInterval(
        () => {
          // Don't show loading state for background refreshes
          const refreshNotifications = async () => {
            try {
              const result = await fetchNotifications()
              if (result && result.notifications) {
                setNotifications(result.notifications)
              }
            } catch (err) {
              console.error("Error refreshing notifications:", err)
              // Don't update error state or fallback for background refreshes
            }
          }

          refreshNotifications()
        },
        5 * 60 * 1000,
      )
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isInitialized])

  const unreadCount = notifications.filter((notification) => !notification.read).length
  const notificationsCount = notifications.length

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    setIsLoading(true)
    try {
      await markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (err) {
      console.error("Error marking notification as read:", err)
      setError("Failed to mark notification as read")

      // Still update the UI even if the API call fails
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      // This would typically be a single API call in a real app
      const unreadNotifications = notifications.filter((notification) => !notification.read)
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id)
      }

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      setError("Failed to mark all notifications as read")

      // Still update the UI even if the API call fails
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        notificationsCount,
        markAsRead,
        markAllAsRead,
        isLoading,
        error,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
