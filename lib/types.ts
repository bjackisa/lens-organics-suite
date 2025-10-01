export type UserRole = "super_admin" | "admin" | "employee"
export type FarmLocation = "nakaseke" | "bukeerere"
export type DepartmentType = "lemongrass" | "chicken" | "fish" | "coffee" | "macadamia" | "avocado"
export type OperationLevel = "farm" | "value_addition" | "sales"

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  location?: FarmLocation
  department?: DepartmentType
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: DepartmentType
  description?: string
  has_farm: boolean
  has_value_addition: boolean
  has_sales: boolean
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  department: DepartmentType
  level: OperationLevel
  location: FarmLocation
  quantity: number
  unit: string
  unit_price?: number
  reorder_level?: number
  description?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface FleetVehicle {
  id: string
  vehicle_name: string
  vehicle_type: string
  registration_number: string
  location: FarmLocation
  status: "available" | "in_use" | "maintenance"
  last_service_date?: string
  next_service_date?: string
  created_at: string
  updated_at: string
}

export interface SalesOrder {
  id: string
  order_number: string
  customer_name: string
  customer_contact?: string
  customer_email?: string
  department: DepartmentType
  location: FarmLocation
  total_amount: number
  payment_status: "pending" | "partial" | "paid"
  order_status: "pending" | "processing" | "completed" | "cancelled"
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}
