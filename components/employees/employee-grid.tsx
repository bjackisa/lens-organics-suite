"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Profile, UserRole } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { Mail, MapPin, Phone, Shield, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmployeeEditForm } from "./employee-edit-form"

interface EmployeeGridProps {
  currentUserRole?: UserRole
}

export function EmployeeGrid({ currentUserRole }: EmployeeGridProps) {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const isAdmin = currentUserRole === "super_admin" || currentUserRole === "admin"

  useEffect(() => {
    const fetchEmployees = async () => {
      const supabase = createClient()
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

      const role = searchParams.get("role")
      const department = searchParams.get("department")
      const location = searchParams.get("location")
      const search = searchParams.get("search")

      if (role && role !== "all") {
        query = query.eq("role", role)
      }
      if (department && department !== "all") {
        query = query.eq("department", department)
      }
      if (location && location !== "all") {
        query = query.eq("location", location)
      }
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      const { data } = await query

      if (data) {
        setEmployees(data)
      }
      setLoading(false)
    }

    fetchEmployees()
  }, [searchParams])

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "default"
      case "admin":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Employees ({employees.length})</h2>
      </div>

      {employees.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No employees found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{employee.full_name}</CardTitle>
                      <Badge variant={getRoleBadgeVariant(employee.role)} className="mt-1 text-xs capitalize">
                        <Shield className="mr-1 h-3 w-3" />
                        {employee.role.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>

                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}

                {employee.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{employee.location}</span>
                  </div>
                )}

                {employee.department && (
                  <Badge variant="secondary" className="capitalize">
                    {employee.department}
                  </Badge>
                )}

                {!employee.is_active && <Badge variant="destructive">Inactive</Badge>}

                {isAdmin && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                        Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>Update employee information and permissions</DialogDescription>
                      </DialogHeader>
                      <EmployeeEditForm
                        employee={employee}
                        onSuccess={() => {
                          window.location.reload()
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
