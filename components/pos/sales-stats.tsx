"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function SalesStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [orders, pending, completed] = await Promise.all([
        supabase.from("sales_orders").select("total_amount"),
        supabase.from("sales_orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
        supabase.from("sales_orders").select("id", { count: "exact", head: true }).eq("order_status", "completed"),
      ])

      const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      setStats({
        totalRevenue,
        totalOrders: orders.data?.length || 0,
        pendingOrders: pending.count || 0,
        completedOrders: completed.count || 0,
      })
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Revenue",
      value: `UGX ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
