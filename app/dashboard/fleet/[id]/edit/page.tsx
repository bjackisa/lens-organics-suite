import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VehicleForm } from "@/components/fleet/vehicle-form"

interface EditVehiclePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
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

  const { data: vehicle } = await supabase.from("fleet_vehicles").select("*").eq("id", id).single()

  if (!vehicle) {
    notFound()
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
          <h1 className="text-3xl font-bold">Edit Vehicle</h1>
          <p className="text-muted-foreground">Update vehicle details</p>
        </div>
      </div>

      <VehicleForm initialData={vehicle} />
    </div>
  )
}
