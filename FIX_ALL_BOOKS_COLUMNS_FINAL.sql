-- =====================================================
-- COMPLETE BOOKS TABLE FIX - ALL MISSING COLUMNS
-- =====================================================
-- This script adds ALL missing columns to fix all 400 errors

-- Add all missing columns to books table
DO $$
BEGIN
  -- Add stock_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'stock_status'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN stock_status TEXT DEFAULT 'in_stock';
  END IF;

  -- Add for_sale column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'for_sale'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN for_sale BOOLEAN DEFAULT false;
  END IF;

  -- Add type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'type'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN type TEXT DEFAULT 'book';
  END IF;

  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'description'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN description TEXT;
  END IF;

  -- Add cover_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'cover_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN cover_url TEXT;
  END IF;

  -- Add pdf_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'pdf_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN pdf_url TEXT;
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'created_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add published column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'published'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN published BOOLEAN DEFAULT true;
  END IF;

  -- Add isbn column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'isbn'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN isbn TEXT;
  END IF;

  -- Add pages column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'pages'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN pages INTEGER;
  END IF;

  -- Add language column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'language'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN language TEXT DEFAULT 'english';
  END IF;

  -- Add price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' 
    AND column_name = 'price'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE books ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- Update existing records with default values
UPDATE books SET 
  stock_status = COALESCE(stock_status, 'in_stock'),
  for_sale = COALESCE(for_sale, false),
  type = COALESCE(type, 'book'),
  published = COALESCE(published, true),
  language = COALESCE(language, 'english'),
  price = COALESCE(price, 0)
WHERE stock_status IS NULL OR for_sale IS NULL OR type IS NULL OR published IS NULL OR language IS NULL OR price IS NULL;

-- Verify all columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- ALL BOOKS COLUMNS ADDED SUCCESSFULLY
-- =====================================================
-- The books table now has all required columns for the admin system
