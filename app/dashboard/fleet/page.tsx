import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { FleetVehiclesList } from "@/components/fleet/fleet-vehicles-list"
import { FleetStats } from "@/components/fleet/fleet-stats"

export default async function FleetPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const isAdmin = profile?.role === "super_admin" || profile?.role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Monitor vehicles and track usage across locations</p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/fleet/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        )}
      </div>

      <FleetStats />
      <FleetVehiclesList isAdmin={isAdmin} />
    </div>
  )
}
