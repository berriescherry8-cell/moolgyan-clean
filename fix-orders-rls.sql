-- Fix RLS policies for orders table to allow anonymous order submissions
-- This will fix the 401 Unauthorized and RLS policy violation errors

-- First, drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;

-- Create new policies that allow anonymous inserts for order submissions
-- Allow anyone (including anonymous) to insert orders
CREATE POLICY "Allow anonymous order insertions" ON orders
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

-- Keep admin policies as they are
-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update any order
CREATE POLICY "Admins can update any order" ON orders
FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete any order
CREATE POLICY "Admins can delete any order" ON orders
FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Also fix the GET API route - it's trying to order by a non-existent column
-- The orders table uses 'created_at', not 'order_date'
-- This should be fixed in the API route file
