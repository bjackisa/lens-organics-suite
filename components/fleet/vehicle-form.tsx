"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface VehicleFormProps {
  initialData?: any
}

export function VehicleForm({ initialData }: VehicleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    vehicle_name: initialData?.vehicle_name || "",
    vehicle_type: initialData?.vehicle_type || "",
    registration_number: initialData?.registration_number || "",
    location: initialData?.location || "",
    status: initialData?.status || "available",
    last_service_date: initialData?.last_service_date || "",
    next_service_date: initialData?.next_service_date || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const data = {
      ...formData,
      last_service_date: formData.last_service_date || null,
      next_service_date: formData.next_service_date || null,
    }

    let error
    if (initialData) {
      const result = await supabase.from("fleet_vehicles").update(data).eq("id", initialData.id)
      error = result.error
    } else {
      const result = await supabase.from("fleet_vehicles").insert([data])
      error = result.error
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: initialData ? "Vehicle updated successfully" : "Vehicle added successfully",
      })
      router.push("/dashboard/fleet")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit" : "Add"} Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle_name">Vehicle Name *</Label>
              <Input
                id="vehicle_name"
                required
                placeholder="e.g., Pickup Truck 1"
                value={formData.vehicle_name}
                onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Vehicle Type *</Label>
              <Input
                id="vehicle_type"
                required
                placeholder="e.g., Truck, Tractor, Van"
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number *</Label>
              <Input
                id="registration_number"
                required
                placeholder="e.g., UAH 123X"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                required
                value={formData.location}
                onValueChange={(v) => setFormData({ ...formData, location: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nakaseke">Nakaseke</SelectItem>
                  <SelectItem value="bukeerere">Bukeerere</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select required value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_service_date">Last Service Date</Label>
              <Input
                id="last_service_date"
                type="date"
                value={formData.last_service_date}
                onChange={(e) => setFormData({ ...formData, last_service_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_service_date">Next Service Date</Label>
              <Input
                id="next_service_date"
                type="date"
                value={formData.next_service_date}
                onChange={(e) => setFormData({ ...formData, next_service_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Vehicle" : "Add Vehicle"}
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
