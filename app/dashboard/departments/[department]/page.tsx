import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Package, Factory, ShoppingBag } from "lucide-react"
import type { DepartmentType } from "@/lib/types"

interface DepartmentDetailPageProps {
  params: Promise<{ department: DepartmentType }>
}

const departmentNames: Record<string, string> = {
  lemongrass: "Lemongrass",
  chicken: "Chicken (Kroilers)",
  fish: "Catfish",
  coffee: "Coffee",
  macadamia: "Macadamia Nuts",
  avocado: "Avocado",
}

const levelInfo = {
  farm: {
    icon: Package,
    title: "Farm Level",
    description: "Manage cultivation, harvesting, and third-party farmer purchases",
    color: "text-green-600",
  },
  value_addition: {
    icon: Factory,
    title: "Value Addition Level",
    description: "Process raw materials into finished products",
    color: "text-blue-600",
  },
  sales: {
    icon: ShoppingBag,
    title: "Sales Level",
    description: "Manage B2B sales and customer orders",
    color: "text-purple-600",
  },
}

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  const { department: deptName } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: department } = await supabase.from("departments").select("*").eq("name", deptName).single()

  if (!department) {
    notFound()
  }

  const displayName = departmentNames[department.name] || department.name

  // Fetch stats for this department
  const [inventoryCount, salesCount] = await Promise.all([
    supabase.from("inventory_items").select("id", { count: "exact", head: true }).eq("department", deptName),
    supabase.from("sales_orders").select("id", { count: "exact", head: true }).eq("department", deptName),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/departments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryCount.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sales Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesCount.count || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Operational Levels</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {department.has_farm && (
            <Link href={`/dashboard/departments/${deptName}/farm`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <levelInfo.farm.icon className={`h-8 w-8 ${levelInfo.farm.color}`} />
                    <div>
                      <CardTitle>{levelInfo.farm.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{levelInfo.farm.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Active</Badge>
                </CardContent>
              </Card>
            </Link>
          )}

          <Card className={!department.has_value_addition ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <levelInfo.value_addition.icon className={`h-8 w-8 ${levelInfo.value_addition.color}`} />
                <div>
                  <CardTitle>{levelInfo.value_addition.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">{levelInfo.value_addition.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {department.has_value_addition ? (
                <Link href={`/dashboard/departments/${deptName}/value-addition`}>
                  <Badge variant="secondary">Active</Badge>
                </Link>
              ) : (
                <Badge variant="outline">Coming Soon</Badge>
              )}
            </CardContent>
          </Card>

          {department.has_sales && (
            <Link href={`/dashboard/departments/${deptName}/sales`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <levelInfo.sales.icon className={`h-8 w-8 ${levelInfo.sales.color}`} />
                    <div>
                      <CardTitle>{levelInfo.sales.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{levelInfo.sales.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Active</Badge>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
