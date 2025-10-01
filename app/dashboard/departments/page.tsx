import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DepartmentCard } from "@/components/departments/department-card"

export default async function DepartmentsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: departments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">Manage operations across all departments and levels</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments?.map((dept) => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>
    </div>
  )
}
