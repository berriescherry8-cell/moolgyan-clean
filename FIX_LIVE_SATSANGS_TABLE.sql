-- =====================================================
-- FIX LIVE_SATSANGS TABLE - ADD MISSING COLUMNS
-- =====================================================
-- This script adds missing columns to live_satsangs table

-- Add all missing columns to live_satsangs table
DO $$
BEGIN
  -- Add for_sale column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'for_sale'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN for_sale BOOLEAN DEFAULT false;
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'created_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Add is_live column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'is_live'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN is_live BOOLEAN DEFAULT false;
  END IF;

  -- Add youtube_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'youtube_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN youtube_url TEXT;
  END IF;

  -- Add title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'title'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN title TEXT;
  END IF;

  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'description'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN description TEXT;
  END IF;

  -- Add scheduled_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'scheduled_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add duration column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'duration'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN duration TEXT;
  END IF;

  -- Add thumbnail_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'thumbnail_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN thumbnail_url TEXT;
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'category'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN category TEXT DEFAULT 'satsang';
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'tags'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN tags TEXT;
  END IF;

  -- Add is_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'is_active'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Add created_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'created_by'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;

  -- Add view_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'view_count'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update existing records with default values
UPDATE live_satsangs SET 
  for_sale = COALESCE(for_sale, false),
  is_live = COALESCE(is_live, false),
  category = COALESCE(category, 'satsang'),
  is_active = COALESCE(is_active, true),
  view_count = COALESCE(view_count, 0)
WHERE for_sale IS NULL OR is_live IS NULL OR category IS NULL OR is_active IS NULL OR view_count IS NULL;

-- Verify all columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'live_satsangs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- LIVE_SATSANGS TABLE FIXED
-- =====================================================
-- The live_satsangs table now has all required columns
