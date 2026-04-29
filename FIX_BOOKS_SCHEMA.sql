-- Update books table schema to match frontend expectations
-- Run this in Supabase SQL Editor

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert" ON books;
DROP POLICY IF EXISTS "Allow authenticated update" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete" ON books;
DROP POLICY IF EXISTS "Allow authenticated read books" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert books" ON books;
DROP POLICY IF EXISTS "Allow authenticated update books" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete books" ON books;
DROP POLICY IF EXISTS "Allow anon read books" ON books;

-- Drop existing trigger
DROP TRIGGER IF EXISTS update_books_updated_at ON books;

-- Add missing columns (safe to run multiple times due to IF NOT EXISTS)
ALTER TABLE books 
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS stock_status_new TEXT CHECK (stock_status_new IN ('in_stock', 'out_of_stock', 'read_only')) DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS access_mode TEXT CHECK (access_mode IN ('read_only', 'sell_only')) DEFAULT 'sell_only',
  ADD COLUMN IF NOT EXISTS isbn TEXT,
  ADD COLUMN IF NOT EXISTS publisher TEXT,
  ADD COLUMN IF NOT EXISTS publication_date TEXT,
  ADD COLUMN IF NOT EXISTS pages INTEGER,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Hindi',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Migrate old data: copy author to author_name if author_name is null
UPDATE books SET author_name = author WHERE author_name IS NULL AND author IS NOT NULL;

-- Migrate old data: copy cover_url to cover_image_url if cover_image_url is null
UPDATE books SET cover_image_url = cover_url WHERE cover_image_url IS NULL AND cover_url IS NOT NULL;

-- Migrate old stock_status values to new format
UPDATE books SET stock_status_new = 'in_stock' WHERE stock_status = 'in-stock';
UPDATE books SET stock_status_new = 'out_of_stock' WHERE stock_status = 'out-of-stock';
UPDATE books SET stock_status_new = 'read_only' WHERE stock_status = 'read-only';

-- Drop old columns (after migration)
ALTER TABLE books DROP COLUMN IF EXISTS stock_status;

-- Rename new column to match frontend
ALTER TABLE books RENAME COLUMN stock_status_new TO stock_status;

-- Drop old columns that are no longer needed (keep for safety, uncomment if sure)
-- ALTER TABLE books DROP COLUMN IF EXISTS author;
-- ALTER TABLE books DROP COLUMN IF EXISTS cover_url;

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create new policies
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

-- Allow anon/public read
CREATE POLICY "Allow anon read books"
  ON books FOR SELECT
  TO anon
  USING (true);

-- Recreate updated_at trigger
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

-- Make required fields NOT NULL where appropriate
-- Only if data already exists and is valid
-- ALTER TABLE books ALTER COLUMN slug SET NOT NULL;

