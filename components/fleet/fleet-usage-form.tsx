"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { FleetVehicle } from "@/lib/types"

interface FleetUsageFormProps {
  userId: string
}

export function FleetUsageForm({ userId }: FleetUsageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [formData, setFormData] = useState({
    vehicle_id: "",
    purpose: "",
    start_time: "",
    end_time: "",
    start_mileage: "",
    end_mileage: "",
    fuel_used: "",
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("status", "available")

      if (data) {
        setVehicles(data)
      }
    }

    fetchVehicles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const data = {
      vehicle_id: formData.vehicle_id,
      driver_id: userId,
      purpose: formData.purpose,
      start_time: formData.start_time,
      end_time: formData.end_time || null,
      start_mileage: formData.start_mileage ? Number.parseFloat(formData.start_mileage) : null,
      end_mileage: formData.end_mileage ? Number.parseFloat(formData.end_mileage) : null,
      fuel_used: formData.fuel_used ? Number.parseFloat(formData.fuel_used) : null,
    }

    const { error } = await supabase.from("fleet_usage").insert([data])

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      // Update vehicle status to in_use if end_time is not provided
      if (!formData.end_time) {
        await supabase.from("fleet_vehicles").update({ status: "in_use" }).eq("id", formData.vehicle_id)
      }

      toast({
        title: "Success",
        description: "Fleet usage logged successfully",
      })
      router.push("/dashboard/fleet")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Fleet Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle_id">Vehicle *</Label>
            <Select
              required
              value={formData.vehicle_id}
              onValueChange={(v) => setFormData({ ...formData, vehicle_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicle_name} - {vehicle.registration_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Textarea
              id="purpose"
              required
              placeholder="Describe the purpose of this trip"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_mileage">Start Mileage (km)</Label>
              <Input
                id="start_mileage"
                type="number"
                step="0.1"
                value={formData.start_mileage}
                onChange={(e) => setFormData({ ...formData, start_mileage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_mileage">End Mileage (km)</Label>
              <Input
                id="end_mileage"
                type="number"
                step="0.1"
                value={formData.end_mileage}
                onChange={(e) => setFormData({ ...formData, end_mileage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_used">Fuel Used (liters)</Label>
              <Input
                id="fuel_used"
                type="number"
                step="0.1"
                value={formData.fuel_used}
                onChange={(e) => setFormData({ ...formData, fuel_used: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging..." : "Log Usage"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
