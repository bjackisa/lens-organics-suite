"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function EmployeeFilters() {
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
      router.push(`/dashboard/employees?${params.toString()}`)
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
              placeholder="Search by name or email..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue={searchParams.get("role") || "all"} onValueChange={(v) => updateFilter("role", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
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
