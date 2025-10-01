"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/types"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Wrench,
  Building2,
  FileText,
  Settings,
  Sprout,
} from "lucide-react"

interface DashboardSidebarProps {
  profile: Profile | null
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Departments", href: "/dashboard/departments", icon: Building2 },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Fleet", href: "/dashboard/fleet", icon: Truck },
  { name: "Point of Sale", href: "/dashboard/pos", icon: ShoppingCart },
  { name: "Tools & Equipment", href: "/dashboard/tools", icon: Wrench },
  { name: "Third-Party Farmers", href: "/dashboard/farmers", icon: Sprout },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Image
            src="https://www.lensorganics.com/images/lens-organics-logo.png"
            alt="Lens Organics"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">Lens Organics</span>
            <span className="text-xs text-muted-foreground">Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role?.replace("_", " ")}</p>
            {profile?.location && <p className="mt-1 text-xs text-muted-foreground capitalize">{profile.location}</p>}
          </div>
        </div>
      </div>
    </aside>
  )
}
