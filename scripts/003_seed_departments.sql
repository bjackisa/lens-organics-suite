-- Insert department data
INSERT INTO public.departments (name, description, has_farm, has_value_addition, has_sales) VALUES
  ('lemongrass', 'Lemongrass cultivation and processing', true, true, true),
  ('chicken', 'Kroiler chicken for eggs and meat', true, false, true),
  ('fish', 'Catfish rearing and sales', true, false, true),
  ('coffee', 'Coffee growing and processing', true, false, true),
  ('macadamia', 'Macadamia nuts cultivation', true, false, true),
  ('avocado', 'Avocado growing and sales', true, false, true)
ON CONFLICT (name) DO NOTHING;
