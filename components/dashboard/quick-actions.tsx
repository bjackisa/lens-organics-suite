"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/types"

interface QuickActionsProps {
  userRole?: UserRole
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const isAdmin = userRole === "super_admin" || userRole === "admin"

  const actions = [
    {
      label: "New Sale",
      href: "/dashboard/pos/new",
      description: "Create a new sales order",
    },
    {
      label: "Add Inventory",
      href: "/dashboard/inventory/new",
      description: "Add new inventory item",
      adminOnly: true,
    },
    {
      label: "Log Fleet Usage",
      href: "/dashboard/fleet/log",
      description: "Record vehicle usage",
    },
    {
      label: "Record Purchase",
      href: "/dashboard/farmers/purchase",
      description: "From third-party farmer",
    },
  ]

  const availableActions = actions.filter((action) => !action.adminOnly || isAdmin)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {availableActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
