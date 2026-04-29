-- FIX ORDERS TABLE customer_email NOT NULL ERROR
-- Run in Supabase SQL Editor

-- 1. Make customer_email nullable or add default
ALTER TABLE orders ALTER COLUMN customer_email SET DEFAULT '';

-- 2. Fix existing NULL values
UPDATE orders SET customer_email = COALESCE(customer_email, '') WHERE customer_email IS NULL;

-- 3. Make optional if not needed
ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;

-- 4. Reload
NOTIFY pgrst, 'reload schema';

-- 5. Verify
SELECT column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'customer_email';

