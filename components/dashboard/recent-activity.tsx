"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: string
  description: string
  created_at: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient()

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from("inventory_transactions")
        .select("id, transaction_type, quantity, created_at, item_id, inventory_items(name)")
        .order("created_at", { ascending: false })
        .limit(5)

      if (transactions) {
        const formattedActivities: Activity[] = transactions.map((t: any) => ({
          id: t.id,
          type: "inventory",
          description: `${t.transaction_type} - ${t.quantity} units of ${t.inventory_items?.name || "item"}`,
          created_at: t.created_at,
        }))
        setActivities(formattedActivities)
      }
    }

    fetchActivities()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
