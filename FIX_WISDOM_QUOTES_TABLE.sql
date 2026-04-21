-- =====================================================
-- FIX WISDOM_QUOTES TABLE - ADD MISSING COLUMNS
-- =====================================================
-- This script adds missing columns to wisdom_quotes table

-- Add all missing columns to wisdom_quotes table
DO $$
BEGIN
  -- Add for_sale column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'for_sale'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN for_sale BOOLEAN DEFAULT false;
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'created_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add is_daily column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'is_daily'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN is_daily BOOLEAN DEFAULT false;
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'category'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN category TEXT DEFAULT 'general';
  END IF;

  -- Add source column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'source'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN source TEXT;
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'tags'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN tags TEXT;
  END IF;

  -- Add display_order column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'display_order'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;

  -- Add is_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'is_active'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Add created_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wisdom_quotes' 
    AND column_name = 'created_by'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE wisdom_quotes ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update existing records with default values
UPDATE wisdom_quotes SET 
  for_sale = COALESCE(for_sale, false),
  is_daily = COALESCE(is_daily, false),
  category = COALESCE(category, 'general'),
  display_order = COALESCE(display_order, 0),
  is_active = COALESCE(is_active, true)
WHERE for_sale IS NULL OR is_daily IS NULL OR category IS NULL OR display_order IS NULL OR is_active IS NULL;

-- Verify all columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'wisdom_quotes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- WISDOM_QUOTES TABLE FIXED
-- =====================================================
-- The wisdom_quotes table now has all required columns
