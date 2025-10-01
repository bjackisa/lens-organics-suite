-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'employee');
CREATE TYPE farm_location AS ENUM ('nakaseke', 'bukeerere');
CREATE TYPE department_type AS ENUM ('lemongrass', 'chicken', 'fish', 'coffee', 'macadamia', 'avocado');
CREATE TYPE operation_level AS ENUM ('farm', 'value_addition', 'sales');

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  phone TEXT,
  location farm_location,
  department department_type,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name department_type NOT NULL UNIQUE,
  description TEXT,
  has_farm BOOLEAN DEFAULT true,
  has_value_addition BOOLEAN DEFAULT false,
  has_sales BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department department_type NOT NULL,
  level operation_level NOT NULL,
  location farm_location NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10, 2),
  reorder_level DECIMAL(10, 2),
  description TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory transactions table
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
  quantity DECIMAL(10, 2) NOT NULL,
  from_location farm_location,
  to_location farm_location,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fleet vehicles table
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  location farm_location NOT NULL,
  status TEXT DEFAULT 'available', -- 'available', 'in_use', 'maintenance'
  last_service_date DATE,
  next_service_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fleet usage logs
CREATE TABLE IF NOT EXISTS public.fleet_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.profiles(id),
  purpose TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  start_mileage DECIMAL(10, 2),
  end_mileage DECIMAL(10, 2),
  fuel_used DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales orders table
CREATE TABLE IF NOT EXISTS public.sales_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_contact TEXT,
  customer_email TEXT,
  department department_type NOT NULL,
  location farm_location NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid'
  order_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales order items
CREATE TABLE IF NOT EXISTS public.sales_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.inventory_items(id),
  item_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools and equipment table
CREATE TABLE IF NOT EXISTS public.tools_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location farm_location NOT NULL,
  department department_type,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT DEFAULT 'good', -- 'good', 'fair', 'poor', 'needs_repair'
  purchase_date DATE,
  last_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Third-party farmers table
CREATE TABLE IF NOT EXISTS public.third_party_farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  location TEXT,
  department department_type NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Third-party purchases table
CREATE TABLE IF NOT EXISTS public.third_party_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.third_party_farmers(id),
  department department_type NOT NULL,
  product_name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  purchase_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.third_party_farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.third_party_purchases ENABLE ROW LEVEL SECURITY;
