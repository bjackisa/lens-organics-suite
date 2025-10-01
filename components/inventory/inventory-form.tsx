"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface InventoryFormProps {
  userId: string
  initialData?: any
}

export function InventoryForm({ userId, initialData }: InventoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    department: initialData?.department || "",
    level: initialData?.level || "",
    location: initialData?.location || "",
    quantity: initialData?.quantity || "",
    unit: initialData?.unit || "",
    unit_price: initialData?.unit_price || "",
    reorder_level: initialData?.reorder_level || "",
    description: initialData?.description || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const data = {
      ...formData,
      quantity: Number.parseFloat(formData.quantity),
      unit_price: formData.unit_price ? Number.parseFloat(formData.unit_price) : null,
      reorder_level: formData.reorder_level ? Number.parseFloat(formData.reorder_level) : null,
      created_by: userId,
    }

    let error
    if (initialData) {
      const result = await supabase.from("inventory_items").update(data).eq("id", initialData.id)
      error = result.error
    } else {
      const result = await supabase.from("inventory_items").insert([data])
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
        description: initialData ? "Inventory item updated successfully" : "Inventory item added successfully",
      })
      router.push("/dashboard/inventory")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit" : "Add"} Inventory Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                required
                value={formData.department}
                onValueChange={(v) => setFormData({ ...formData, department: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lemongrass">Lemongrass</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="fish">Catfish</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="macadamia">Macadamia</SelectItem>
                  <SelectItem value="avocado">Avocado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select required value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farm">Farm</SelectItem>
                  <SelectItem value="value_addition">Value Addition</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                required
                placeholder="e.g., kg, liters, pieces"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price (UGX)</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder_level">Reorder Level</Label>
              <Input
                id="reorder_level"
                type="number"
                step="0.01"
                placeholder="Low stock threshold"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Item" : "Add Item"}
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
