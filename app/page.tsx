import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="https://www.lensorganics.com/images/lens-organics-logo.png"
              alt="Lens Organics"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold text-primary">Lens Organics Suite</h1>
          </div>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-balance text-primary">
            Enterprise Management for Organic Farming
          </h2>
          <p className="mb-8 text-lg text-muted-foreground text-pretty">
            Comprehensive solution for managing farm operations, inventory, fleet, sales, and accounting across Nakaseke
            and Bukeerere locations.
          </p>

          <div className="mb-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">🌾</div>
              <h3 className="mb-2 font-semibold">Farm Management</h3>
              <p className="text-sm text-muted-foreground">Track operations across all departments and levels</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">📦</div>
              <h3 className="mb-2 font-semibold">Inventory Control</h3>
              <p className="text-sm text-muted-foreground">Real-time tracking of all products and materials</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">🚜</div>
              <h3 className="mb-2 font-semibold">Fleet Management</h3>
              <p className="text-sm text-muted-foreground">Monitor vehicles and equipment usage</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">💰</div>
              <h3 className="mb-2 font-semibold">Point of Sale</h3>
              <p className="text-sm text-muted-foreground">B2B sales management and tracking</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">👥</div>
              <h3 className="mb-2 font-semibold">Employee Management</h3>
              <p className="text-sm text-muted-foreground">Manage staff across locations and departments</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-2 text-3xl">📊</div>
              <h3 className="mb-2 font-semibold">Accounting & Reports</h3>
              <p className="text-sm text-muted-foreground">Financial tracking and analytics</p>
            </div>
          </div>

          <Link href="/auth/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Lens Organics. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
