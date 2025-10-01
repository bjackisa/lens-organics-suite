"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, CheckCircle, Wrench, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function FleetStats() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [total, available, inUse, maintenance] = await Promise.all([
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("status", "in_use"),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("status", "maintenance"),
      ])

      setStats({
        total: total.count || 0,
        available: available.count || 0,
        inUse: inUse.count || 0,
        maintenance: maintenance.count || 0,
      })
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: Truck,
      color: "text-blue-600",
    },
    {
      title: "Available",
      value: stats.available,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "In Use",
      value: stats.inUse,
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: Wrench,
      color: "text-red-600",
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
