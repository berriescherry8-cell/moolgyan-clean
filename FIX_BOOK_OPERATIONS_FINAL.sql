-- =====================================================
-- FIX BOOK OPERATIONS - FINAL VERSION
-- =====================================================
-- This script ensures books table has proper structure and fixes 400 errors

-- Step 1: Check books table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Add missing columns if needed
DO $$
BEGIN
  -- Check and add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'created_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Check and add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Check and add published column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'published'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN published BOOLEAN DEFAULT true;
  END IF;

  -- Check and add author column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'author'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN author TEXT;
  END IF;

  -- Check and add type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'type'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN type TEXT DEFAULT 'book';
  END IF;

  -- Check and add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'description'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN description TEXT;
  END IF;

  -- Check and add cover_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'cover_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN cover_url TEXT;
  END IF;

  -- Check and add file_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'file_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN file_url TEXT;
  END IF;

  -- Check and add price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'price'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Make price column nullable to avoid constraint violations
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'price'
    AND table_schema = 'public'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE books ALTER COLUMN price DROP NOT NULL;
  END IF;

  -- Check and add isbn column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'isbn'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN isbn TEXT;
  END IF;

  -- Check and add pages column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'pages'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN pages INTEGER;
  END IF;

  -- Check and add language column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'language'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN language TEXT DEFAULT 'english';
  END IF;
END $$;

-- Step 3: Enable RLS on books table
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies on books
DROP POLICY IF EXISTS "Public can view books" ON books;
DROP POLICY IF EXISTS "Admins can view all books" ON books;
DROP POLICY IF EXISTS "Admins can manage books" ON books;

-- Step 5: Create simple RLS policies for books
CREATE POLICY "Public can view published books" ON books
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage books" ON books
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Step 6: Verify books table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 7: Test book insert (this should work now)
INSERT INTO books (title, author, published, created_at, updated_at, price, type, description, cover_url, file_url, isbn, pages, language)
VALUES (
  'Test Book',
  'Test Author',
  true,
  NOW(),
  NOW(),
  0.00,
  'book',
  'Test book description',
  '',
  '',
  '',
  0,
  'english'
)
ON CONFLICT DO NOTHING;

-- Step 8: Verify test book was inserted
SELECT * FROM books WHERE title = 'Test Book';

-- Step 9: Clean up test data
DELETE FROM books WHERE title = 'Test Book';

-- =====================================================
-- BOOK OPERATIONS FIXED
-- =====================================================
-- Books table now has proper structure and RLS policies
-- Admin can create/update books, public can view published books
