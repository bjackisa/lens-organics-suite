import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VehicleForm } from "@/components/fleet/vehicle-form"

export default async function NewVehiclePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const isAdmin = profile?.role === "super_admin" || profile?.role === "admin"

  if (!isAdmin) {
    redirect("/dashboard/fleet")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fleet">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Vehicle</h1>
          <p className="text-muted-foreground">Register a new vehicle to the fleet</p>
        </div>
      </div>

      <VehicleForm />
    </div>
  )
}
