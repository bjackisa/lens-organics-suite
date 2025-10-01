"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { InventoryItem } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { Edit, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InventoryTableProps {
  isAdmin: boolean
}

export function InventoryTable({ isAdmin }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchInventory = async () => {
      const supabase = createClient()
      let query = supabase.from("inventory_items").select("*").order("created_at", { ascending: false })

      const department = searchParams.get("department")
      const level = searchParams.get("level")
      const location = searchParams.get("location")
      const search = searchParams.get("search")

      if (department && department !== "all") {
        query = query.eq("department", department)
      }
      if (level && level !== "all") {
        query = query.eq("level", level)
      }
      if (location && location !== "all") {
        query = query.eq("location", location)
      }
      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      const { data } = await query

      if (data) {
        setItems(data)
      }
      setLoading(false)
    }

    fetchInventory()
  }, [searchParams])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inventory items found. Try adjusting your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const isLowStock = item.reorder_level && item.quantity <= item.reorder_level
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize">{item.department}</TableCell>
                      <TableCell className="capitalize">{item.level.replace("_", " ")}</TableCell>
                      <TableCell className="capitalize">{item.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.quantity} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.unit_price ? `UGX ${item.unit_price.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Link href={`/dashboard/inventory/${item.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
