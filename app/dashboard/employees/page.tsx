import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmployeeFilters } from "@/components/employees/employee-filters"
import { EmployeeGrid } from "@/components/employees/employee-grid"

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <p className="text-muted-foreground">Manage staff across all departments and locations</p>
      </div>

      <EmployeeFilters />
      <EmployeeGrid currentUserRole={profile?.role} />
    </div>
  )
}
