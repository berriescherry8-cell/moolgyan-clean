-- FIX price_per_item NOT NULL ERROR in orders table
-- Supabase SQL Editor compatible

-- 1. Add price_per_item column if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS price_per_item DECIMAL(10,2);

-- 2. Populate from book_price
UPDATE orders SET price_per_item = book_price WHERE price_per_item IS NULL;

-- 3. Make NOT NULL
ALTER TABLE orders ALTER COLUMN price_per_item SET NOT NULL;

-- 4. Add default for future inserts
ALTER TABLE orders ALTER COLUMN price_per_item SET DEFAULT 0;

-- 5. Reload schema
NOTIFY pgrst, 'reload schema';

-- 6. Verify
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'price_per_item';

