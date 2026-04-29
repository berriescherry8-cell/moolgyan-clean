-- ============================================================
-- COMPLETE ORDERS TABLE FIX
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/lqymwrhfirszrakuevqm/sql/new
-- ============================================================

-- Step 1: Ensure order_number column exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Step 2: Fix existing rows
DO $$
BEGIN
  UPDATE orders SET order_number = 'ORD-' || EXTRACT(EPOCH FROM created_at)::bigint || '-' || floor(random()*1000)::int WHERE order_number IS NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not update existing rows: %', SQLERRM;
END $$;

-- Step 3: Drop conflicting RLS policies
DROP POLICY IF EXISTS "Admins can delete any order" ON orders;
DROP POLICY IF EXISTS "Admins can update any order" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins full access" ON orders;
DROP POLICY IF EXISTS "Allow anonymous order insertions" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for all roles" ON orders;

-- Step 4: Create new RLS policies
CREATE POLICY "Allow anyone to insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for all" ON orders FOR SELECT USING (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Step 5: Create/Fix place_order stored procedure
DROP FUNCTION IF EXISTS place_order(TEXT, TEXT, DECIMAL, INTEGER, TEXT, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION place_order(
  p_book_id TEXT,
  p_book_title TEXT, 
  p_book_price DECIMAL,
  p_quantity INTEGER,
  p_full_name TEXT,
  p_mobile TEXT,
  p_address TEXT,
  p_pin_code TEXT
)
RETURNS JSON AS $$
DECLARE
  v_total DECIMAL(10,2);
  v_order_id UUID;
  v_order_num TEXT;
BEGIN
  v_total := p_quantity * p_book_price;
  v_order_num := 'ORD-' || EXTRACT(EPOCH FROM NOW())::bigint || '-' || floor(random()*1000)::int;
  
  INSERT INTO orders (
    order_number,
    book_id, book_title, book_price, quantity,
    full_name, mobile_number, address, pin_code,
    total_amount, status
  ) VALUES (
    v_order_num,
    p_book_id, p_book_title, p_book_price, p_quantity,
    p_full_name, p_mobile, p_address, p_pin_code,
    v_total, 'pending'
  ) RETURNING id INTO v_order_id;
  
  RETURN json_build_object(
    'success', true,
    'orderId', v_order_id,
    'orderNumber', v_order_num,
    'totalAmount', v_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION place_order(TEXT,TEXT,DECIMAL,INTEGER,TEXT,TEXT,TEXT,TEXT) TO anon, authenticated, service_role;

-- Step 7: Reload schema
NOTIFY pgrst, 'reload schema';

-- Step 8: Verify
SELECT * FROM pg_policies WHERE tablename = 'orders';

