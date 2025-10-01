import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FleetUsageForm } from "@/components/fleet/fleet-usage-form"

export default async function LogFleetUsagePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
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
          <h1 className="text-3xl font-bold">Log Fleet Usage</h1>
          <p className="text-muted-foreground">Record vehicle usage and trip details</p>
        </div>
      </div>

      <FleetUsageForm userId={data.user.id} />
    </div>
  )
}
