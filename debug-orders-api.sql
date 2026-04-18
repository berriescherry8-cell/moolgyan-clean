-- Temporary fix: Disable RLS for orders table to allow server-side inserts
-- This will bypass the RLS policy issue causing 500 errors

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Alternative: Create a service role policy that allows all operations
DROP POLICY IF EXISTS "Service role full access" ON orders;
CREATE POLICY "Service role full access" ON orders
FOR ALL USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'orders';
