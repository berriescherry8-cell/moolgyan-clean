-- SIMPLE Supabase Orders RLS Fix (Copy ALL to SQL Editor)
-- No JWT - Works anonymously

-- 1. Reset
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 2. Remove all policies
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update any order" ON orders;
DROP POLICY IF EXISTS "Admins can delete any order" ON orders;

-- 3. Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. KEY FIX: Public INSERT (no auth needed)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- 5. Admin full access
CREATE POLICY "Admins full access" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 6. Verify (optional)
SELECT policyname FROM pg_policies WHERE tablename = 'orders';

-- DONE! Orders now work without login
