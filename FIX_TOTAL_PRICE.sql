-- FINAL ORDERS TABLE FIX: total_price NOT NULL
-- Supabase SQL Editor compatible

-- 1. Add total_price column if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- 2. Populate from existing data (quantity * price_per_item)
UPDATE orders SET total_price = (quantity * COALESCE(price_per_item, book_price, 0)) 
WHERE total_price IS NULL;

-- 3. Make NOT NULL
ALTER TABLE orders ALTER COLUMN total_price SET NOT NULL;

-- 4. Add default
ALTER TABLE orders ALTER COLUMN total_price SET DEFAULT 0;

-- 5. Reload
NOTIFY pgrst, 'reload schema';

-- 6. Verify ALL price columns
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name LIKE '%price%' OR column_name = 'quantity'
ORDER BY column_name;

