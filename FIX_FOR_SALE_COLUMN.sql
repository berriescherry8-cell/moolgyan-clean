-- =====================================================
-- ADD FOR_SALE COLUMN TO BOOKS TABLE
-- =====================================================
-- This script adds the missing for_sale column to fix the 400 errors

-- Step 1: Add for_sale column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS for_sale BOOLEAN DEFAULT false;

-- Step 2: Make sure column is nullable (in case of existing data)
ALTER TABLE books ALTER COLUMN for_sale DROP NOT NULL;

-- Step 3: Update existing books to have for_sale = false
UPDATE books SET for_sale = false WHERE for_sale IS NULL;

-- Step 4: Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
AND column_name = 'for_sale'
ORDER BY ordinal_position;

-- Step 5: Test the fix
INSERT INTO books (title, author, for_sale, created_at, updated_at)
VALUES (
  'Test Book for Sale Check',
  'Test Author',
  false,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Step 6: Clean up test data
DELETE FROM books WHERE title = 'Test Book for Sale Check';

-- =====================================================
-- FOR_SALE COLUMN ADDED SUCCESSFULLY
-- =====================================================
-- The books table now has the for_sale column
-- This should resolve the 400 errors in data manager
