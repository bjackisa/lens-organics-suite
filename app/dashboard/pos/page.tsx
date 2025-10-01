import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { SalesOrdersTable } from "@/components/pos/sales-orders-table"
import { SalesStats } from "@/components/pos/sales-stats"

export default async function POSPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Point of Sale</h1>
          <p className="text-muted-foreground">Manage B2B sales orders and customer transactions</p>
        </div>
        <Link href="/dashboard/pos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </Link>
      </div>

      <SalesStats />
      <SalesOrdersTable />
    </div>
  )
}
