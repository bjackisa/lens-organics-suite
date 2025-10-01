-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Departments policies (read-only for all authenticated users)
CREATE POLICY "All users can view departments" ON public.departments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Inventory items policies
CREATE POLICY "All users can view inventory" ON public.inventory_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage inventory" ON public.inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Inventory transactions policies
CREATE POLICY "All users can view transactions" ON public.inventory_transactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can create transactions" ON public.inventory_transactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fleet vehicles policies
CREATE POLICY "All users can view vehicles" ON public.fleet_vehicles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage vehicles" ON public.fleet_vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Fleet usage policies
CREATE POLICY "All users can view fleet usage" ON public.fleet_usage
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can log fleet usage" ON public.fleet_usage
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Sales orders policies
CREATE POLICY "All users can view sales orders" ON public.sales_orders
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can create sales orders" ON public.sales_orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update sales orders" ON public.sales_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Sales order items policies
CREATE POLICY "All users can view order items" ON public.sales_order_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can create order items" ON public.sales_order_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Tools and equipment policies
CREATE POLICY "All users can view tools" ON public.tools_equipment
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage tools" ON public.tools_equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Third-party farmers policies
CREATE POLICY "All users can view farmers" ON public.third_party_farmers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage farmers" ON public.third_party_farmers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Third-party purchases policies
CREATE POLICY "All users can view purchases" ON public.third_party_purchases
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can create purchases" ON public.third_party_purchases
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
