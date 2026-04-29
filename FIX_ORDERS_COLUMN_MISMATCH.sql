-- ============================================================
-- FIX ORDERS TABLE COLUMN MISMATCH 
-- The orders table has "customer_name" but code uses "full_name"
-- ============================================================

-- 1. Check current columns
\d orders

-- 2. Add full_name if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '';

-- 3. Update existing customer_name to full_name
UPDATE orders SET full_name = COALESCE(full_name, customer_name);

-- 4. Drop customer_name if it exists (cleanup)
ALTER TABLE orders DROP COLUMN IF EXISTS customer_name;

-- 5. Add missing columns if needed
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mobile_number TEXT NOT NULL DEFAULT '';

-- 6. Fix any NULL full_name values (set to unknown)
UPDATE orders SET full_name = 'Unknown Customer' WHERE full_name IS NULL OR full_name = '';

-- 7. Reload schema
NOTIFY pgrst, 'reload schema';

-- 8. Verify
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'orders' ORDER BY ordinal_position;

