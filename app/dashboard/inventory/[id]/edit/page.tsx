import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { InventoryForm } from "@/components/inventory/inventory-form"

interface EditInventoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditInventoryPage({ params }: EditInventoryPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const isAdmin = profile?.role === "super_admin" || profile?.role === "admin"

  if (!isAdmin) {
    redirect("/dashboard/inventory")
  }

  const { data: item } = await supabase.from("inventory_items").select("*").eq("id", id).single()

  if (!item) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Inventory Item</h1>
          <p className="text-muted-foreground">Update inventory item details</p>
        </div>
      </div>

      <InventoryForm userId={data.user.id} initialData={item} />
    </div>
  )
}
