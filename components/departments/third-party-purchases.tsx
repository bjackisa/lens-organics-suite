"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DepartmentType } from "@/lib/types"
import { Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ThirdPartyPurchasesProps {
  department: DepartmentType
}

interface Purchase {
  id: string
  product_name: string
  quantity: number
  unit: string
  total_amount: number
  purchase_date: string
  third_party_farmers: {
    name: string
  } | null
}

export function ThirdPartyPurchases({ department }: ThirdPartyPurchasesProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchases = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("third_party_purchases")
        .select("*, third_party_farmers(name)")
        .eq("department", department)
        .order("purchase_date", { ascending: false })
        .limit(5)

      if (data) {
        setPurchases(data)
      }
      setLoading(false)
    }

    fetchPurchases()
  }, [department])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Third-Party Purchases</CardTitle>
        <Link href={`/dashboard/farmers/purchase?department=${department}`}>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Record Purchase
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground">No purchases recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <h4 className="font-medium">{purchase.product_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    From: {purchase.third_party_farmers?.name || "Unknown"} •{" "}
                    {format(new Date(purchase.purchase_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">UGX {purchase.total_amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {purchase.quantity} {purchase.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
