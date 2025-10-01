"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FleetVehicle } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface FleetVehiclesListProps {
  isAdmin: boolean
}

export function FleetVehiclesList({ isAdmin }: FleetVehiclesListProps) {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("fleet_vehicles").select("*").order("created_at", { ascending: false })

      if (data) {
        setVehicles(data)
      }
      setLoading(false)
    }

    fetchVehicles()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "in_use":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Vehicles ({vehicles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No vehicles registered yet. Add your first vehicle to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{vehicle.vehicle_name}</h4>
                    <Badge variant={getStatusColor(vehicle.status)} className="capitalize">
                      {vehicle.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{vehicle.registration_number}</span>
                    <span className="capitalize">{vehicle.vehicle_type}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vehicle.location}
                    </span>
                  </div>
                  {vehicle.next_service_date && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Next service: {format(new Date(vehicle.next_service_date), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <Link href={`/dashboard/fleet/${vehicle.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
