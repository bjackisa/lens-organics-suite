"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DepartmentType, SalesOrder } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface SalesOrdersListProps {
  department: DepartmentType
}

export function SalesOrdersList({ department }: SalesOrdersListProps) {
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("sales_orders")
        .select("*")
        .eq("department", department)
        .order("created_at", { ascending: false })

      if (data) {
        setOrders(data)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [department])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sales orders yet. Create your first order to get started.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{order.order_number}</h4>
                    <Badge variant={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name} • {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">UGX {order.total_amount.toLocaleString()}</div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
