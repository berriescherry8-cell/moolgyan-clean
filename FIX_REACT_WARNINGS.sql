-- =====================================================
-- RUN THIS FIRST: ADD FOR_SALE COLUMN TO BOOKS TABLE
-- =====================================================
-- This fixes the main 400 error causing save failures

-- Add for_sale column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS for_sale BOOLEAN DEFAULT false;

-- Make column nullable to avoid constraint issues
ALTER TABLE books ALTER COLUMN for_sale DROP NOT NULL;

-- Update existing books to have for_sale = false
UPDATE books SET for_sale = false WHERE for_sale IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
AND column_name = 'for_sale'
ORDER BY ordinal_position;

-- =====================================================
-- FOR_SALE COLUMN ADDED
-- =====================================================
-- Now the data manager should work without 400 errors
