"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

interface ProductsViewToggleProps {
  view?: string
}

export default function ProductsViewToggle({ view = "grid" }: ProductsViewToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleViewChange = (newView: string) => {
    if (newView === view) return

    const params = new URLSearchParams(window.location.search)
    params.set("view", newView)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-r-none ${view === "grid" ? "bg-muted" : ""}`}
        onClick={() => handleViewChange("grid")}
      >
        <Grid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-l-none ${view === "list" ? "bg-muted" : ""}`}
        onClick={() => handleViewChange("list")}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  )
}
