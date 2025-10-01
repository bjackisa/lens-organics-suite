import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import type { DepartmentType } from "@/lib/types"
import { SalesOrdersList } from "@/components/departments/sales-orders-list"

interface SalesLevelPageProps {
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

export default async function SalesLevelPage({ params }: SalesLevelPageProps) {
  const { department: deptName } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: department } = await supabase.from("departments").select("*").eq("name", deptName).single()

  if (!department || !department.has_sales) {
    notFound()
  }

  const displayName = departmentNames[department.name] || department.name

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/departments/${deptName}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{displayName} - Sales Level</h1>
            <p className="text-muted-foreground">Manage B2B sales and customer orders</p>
          </div>
        </div>
        <Link href={`/dashboard/pos/new?department=${deptName}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </Link>
      </div>

      <SalesOrdersList department={deptName} />
    </div>
  )
}
