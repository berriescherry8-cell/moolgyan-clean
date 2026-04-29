-- Fix orders table schema issues
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the old FK constraint first (book_id BIGINT vs books.id UUID mismatch)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_book_id_fkey;

-- Step 2: Ensure all required columns exist (including book_price which was missing!)
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS book_id TEXT,
  ADD COLUMN IF NOT EXISTS book_title TEXT,
  ADD COLUMN IF NOT EXISTS book_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pin_code TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mobile_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;

-- Step 3: Change book_id to TEXT to match UUID books.id
ALTER TABLE orders ALTER COLUMN book_id TYPE TEXT USING book_id::TEXT;

-- Step 4: Create stored procedure to bypass PostgREST schema cache issues
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
BEGIN
  v_total := p_quantity * p_book_price;
  
  INSERT INTO orders (
    book_id, book_title, book_price, quantity,
    full_name, mobile_number, address, pin_code,
    total_amount, status
  ) VALUES (
    p_book_id, p_book_title, p_book_price, p_quantity,
    p_full_name, p_mobile, p_address, p_pin_code,
    v_total, 'pending'
  )
  RETURNING id INTO v_order_id;
  
  RETURN json_build_object(
    'success', true,
    'orderId', v_order_id,
    'totalAmount', v_total,
    'message', 'Order placed successfully!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Enable public access to the stored procedure
GRANT EXECUTE ON FUNCTION place_order(TEXT, TEXT, DECIMAL, INTEGER, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION place_order(TEXT, TEXT, DECIMAL, INTEGER, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Step 6: Refresh schema cache
NOTIFY pgrst, 'reload schema';
