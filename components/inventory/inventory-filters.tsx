"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function InventoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/dashboard/inventory?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search items..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              defaultValue={searchParams.get("department") || "all"}
              onValueChange={(v) => updateFilter("department", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
            <Label>Level</Label>
            <Select defaultValue={searchParams.get("level") || "all"} onValueChange={(v) => updateFilter("level", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="farm">Farm</SelectItem>
                <SelectItem value="value_addition">Value Addition</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              defaultValue={searchParams.get("location") || "all"}
              onValueChange={(v) => updateFilter("location", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="nakaseke">Nakaseke</SelectItem>
                <SelectItem value="bukeerere">Bukeerere</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
