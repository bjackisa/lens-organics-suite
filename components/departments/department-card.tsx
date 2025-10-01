import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Department } from "@/lib/types"

interface DepartmentCardProps {
  department: Department
}

const departmentIcons: Record<string, string> = {
  lemongrass: "🌿",
  chicken: "🐔",
  fish: "🐟",
  coffee: "☕",
  macadamia: "🌰",
  avocado: "🥑",
}

const departmentNames: Record<string, string> = {
  lemongrass: "Lemongrass",
  chicken: "Chicken (Kroilers)",
  fish: "Catfish",
  coffee: "Coffee",
  macadamia: "Macadamia Nuts",
  avocado: "Avocado",
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const icon = departmentIcons[department.name] || "🌾"
  const displayName = departmentNames[department.name] || department.name

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{icon}</div>
            <div>
              <CardTitle className="text-xl">{displayName}</CardTitle>
              <CardDescription className="mt-1">{department.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {department.has_farm && <Badge variant="secondary">Farm Level</Badge>}
          {department.has_value_addition ? (
            <Badge variant="secondary">Value Addition</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Value Addition - Coming Soon
            </Badge>
          )}
          {department.has_sales && <Badge variant="secondary">Sales Level</Badge>}
        </div>

        <Link href={`/dashboard/departments/${department.name}`}>
          <Button className="w-full bg-transparent" variant="outline">
            View Operations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
