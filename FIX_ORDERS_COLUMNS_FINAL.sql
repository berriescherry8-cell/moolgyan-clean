-- FIX ORDERS TABLE - NO \d COMMAND (Supabase SQL Editor compatible)
-- Run this entire block in Supabase SQL Editor

-- 1. Add required columns if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;

-- 2. Copy customer_name to full_name if customer_name exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
    UPDATE orders SET full_name = COALESCE(full_name, customer_name);
  END IF;
END $$;

-- 3. Drop old customer_name column if exists
ALTER TABLE orders DROP COLUMN IF EXISTS customer_name;

-- 4. Fix NULL values
UPDATE orders SET 
  full_name = COALESCE(full_name, 'Unknown Customer'),
  mobile_number = COALESCE(mobile_number, '0000000000')
WHERE full_name IS NULL OR mobile_number IS NULL;

-- 5. Reload schema
NOTIFY pgrst, 'reload schema';

-- 6. Verify columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('full_name', 'mobile_number', 'order_number')
ORDER BY column_name;

