export interface Notification {
  id: string
  title: string
  message: string
  type: "order" | "product" | "system" | "promotion"
  read: boolean
  createdAt: string
  link?: string
}
