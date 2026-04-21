-- Clean up conflicting RLS policies for orders table
-- Remove all existing policies first
DROP POLICY IF EXISTS "Admins can delete any order" ON orders;
DROP POLICY IF EXISTS "Admins can update any order" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins full access" ON orders;
DROP POLICY IF EXISTS "Allow anonymous order insertions" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Service role full access" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Create clean, non-conflicting policies

-- Allow anyone (including anonymous/service_role) to insert orders
CREATE POLICY "Enable insert for all roles" ON orders
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update their own orders  
CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own orders
CREATE POLICY "Users can delete own orders" ON orders
FOR DELETE USING (auth.role() = 'authenticated');

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update any order
CREATE POLICY "Admins can update any order" ON orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete any order
CREATE POLICY "Admins can delete any order" ON orders
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify clean policies
SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'orders' ORDER BY policyname;
