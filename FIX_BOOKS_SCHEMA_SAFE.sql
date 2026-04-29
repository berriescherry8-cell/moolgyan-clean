-- Safe books schema update - handles missing columns gracefully
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Add all missing columns safely
-- ============================================

-- Add slug (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN slug TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'slug already exists';
END $$;

-- Add author_name (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN author_name TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'author_name already exists';
END $$;

-- Add cover_image_url (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN cover_image_url TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'cover_image_url already exists';
END $$;

-- Add access_mode (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN access_mode TEXT CHECK (access_mode IN ('read_only', 'sell_only')) DEFAULT 'sell_only';
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'access_mode already exists';
END $$;

-- Add isbn (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN isbn TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'isbn already exists';
END $$;

-- Add publisher (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN publisher TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'publisher already exists';
END $$;

-- Add publication_date (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN publication_date TEXT;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'publication_date already exists';
END $$;

-- Add pages (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN pages INTEGER;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'pages already exists';
END $$;

-- Add language (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN language TEXT DEFAULT 'Hindi';
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'language already exists';
END $$;

-- Add tags (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN tags TEXT[] DEFAULT '{}';
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'tags already exists';
END $$;

-- Add is_featured (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN is_featured BOOLEAN DEFAULT false;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'is_featured already exists';
END $$;

-- Add is_active (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN is_active BOOLEAN DEFAULT true;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'is_active already exists';
END $$;

-- Add sort_order (if missing)
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN sort_order INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'sort_order already exists';
END $$;

-- ============================================
-- STEP 2: Fix stock_status if it uses hyphens
-- ============================================

-- Check if stock_status has CHECK constraint with hyphens
-- We'll add a new column with correct values, then swap
DO $$
BEGIN
    ALTER TABLE books ADD COLUMN stock_status_new TEXT CHECK (stock_status_new IN ('in_stock', 'out_of_stock', 'read_only')) DEFAULT 'in_stock';
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE 'stock_status_new already exists';
END $$;

-- Migrate old hyphen values to underscore values (only if old column exists)
DO $$
BEGIN
    UPDATE books SET stock_status_new = 'in_stock' WHERE stock_status = 'in-stock' OR stock_status = 'in_stock';
    UPDATE books SET stock_status_new = 'out_of_stock' WHERE stock_status = 'out-of-stock' OR stock_status = 'out_of_stock';
    UPDATE books SET stock_status_new = 'read_only' WHERE stock_status = 'read-only' OR stock_status = 'read_only';
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'stock_status column not found, setting default';
    UPDATE books SET stock_status_new = 'in_stock' WHERE stock_status_new IS NULL;
END $$;

-- ============================================
-- STEP 3: Drop old columns safely
-- ============================================

-- Drop old stock_status if it exists
DO $$
BEGIN
    ALTER TABLE books DROP COLUMN stock_status;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'stock_status does not exist, skipping';
END $$;

-- Drop old author if it exists (data already in author_name or not needed)
DO $$
BEGIN
    ALTER TABLE books DROP COLUMN author;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'author does not exist, skipping';
END $$;

-- Drop old cover_url if it exists
DO $$
BEGIN
    ALTER TABLE books DROP COLUMN cover_url;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'cover_url does not exist, skipping';
END $$;

-- ============================================
-- STEP 4: Rename new stock_status column
-- ============================================

DO $$
BEGIN
    ALTER TABLE books RENAME COLUMN stock_status_new TO stock_status;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'stock_status_new does not exist';
END $$;

-- ============================================
-- STEP 5: Drop all existing policies
-- ============================================

DROP POLICY IF EXISTS "Allow public read access" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert" ON books;
DROP POLICY IF EXISTS "Allow authenticated update" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete" ON books;
DROP POLICY IF EXISTS "Allow authenticated read books" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert books" ON books;
DROP POLICY IF EXISTS "Allow authenticated update books" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete books" ON books;
DROP POLICY IF EXISTS "Allow anon read books" ON books;

-- ============================================
-- STEP 6: Enable RLS and create new policies
-- ============================================

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update books"
  ON books FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete books"
  ON books FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow anon read books"
  ON books FOR SELECT
  TO anon
  USING (true);

-- ============================================
-- STEP 7: Recreate updated_at trigger
-- ============================================

DROP TRIGGER IF EXISTS update_books_updated_at ON books;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at 
BEFORE UPDATE ON books 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: Verify columns
-- ============================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

