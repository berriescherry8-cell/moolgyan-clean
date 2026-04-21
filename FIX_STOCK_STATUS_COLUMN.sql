-- =====================================================
-- ADD STOCK_STATUS COLUMN TO BOOKS TABLE
-- =====================================================
-- This fixes the stock_status column error

-- Add stock_status column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';

-- Make column nullable to avoid constraint issues
ALTER TABLE books ALTER COLUMN stock_status DROP NOT NULL;

-- Update existing books to have stock_status = 'in_stock'
UPDATE books SET stock_status = 'in_stock' WHERE stock_status IS NULL;

-- Verify column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
AND column_name = 'stock_status'
ORDER BY ordinal_position;

-- =====================================================
-- STOCK_STATUS COLUMN ADDED SUCCESSFULLY
-- =====================================================
-- The books table now has all required columns
