"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Truck, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DashboardStats() {
  const [stats, setStats] = useState({
    inventoryItems: 0,
    employees: 0,
    vehicles: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [inventory, employees, vehicles, orders] = await Promise.all([
        supabase.from("inventory_items").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }),
        supabase.from("sales_orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
      ])

      setStats({
        inventoryItems: inventory.count || 0,
        employees: employees.count || 0,
        vehicles: vehicles.count || 0,
        pendingOrders: orders.count || 0,
      })
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Inventory Items",
      value: stats.inventoryItems,
      icon: Package,
      description: "Total items tracked",
    },
    {
      title: "Employees",
      value: stats.employees,
      icon: Users,
      description: "Active staff members",
    },
    {
      title: "Fleet Vehicles",
      value: stats.vehicles,
      icon: Truck,
      description: "Available vehicles",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: DollarSign,
      description: "Awaiting processing",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
