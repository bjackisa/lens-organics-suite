"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DepartmentType, InventoryItem } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface FarmInventoryListProps {
  department: DepartmentType
}

export function FarmInventoryList({ department }: FarmInventoryListProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("department", department)
        .eq("level", "farm")
        .order("created_at", { ascending: false })

      if (data) {
        setItems(data)
      }
      setLoading(false)
    }

    fetchInventory()
  }, [department])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farm Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farm Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inventory items yet. Add your first item to get started.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.location} • {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">{item.quantity}</div>
                    <div className="text-xs text-muted-foreground">{item.unit}</div>
                  </div>
                  {item.reorder_level && item.quantity <= item.reorder_level && (
                    <Badge variant="destructive">Low Stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
