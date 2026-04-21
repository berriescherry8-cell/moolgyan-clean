-- =====================================================
-- FIX PHOTOS RLS POLICIES - RESTORE SYNC FUNCTIONALITY
-- =====================================================
-- This script fixes the 401 errors in photos section

-- Step 1: Drop existing RLS policies on photos table
DROP POLICY IF EXISTS "Admins can view all photos" ON photos;
DROP POLICY IF EXISTS "Admins can insert photos" ON photos;
DROP POLICY IF EXISTS "Admins can update photos" ON photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON photos;

-- Step 2: Enable RLS on photos table (if not already enabled)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new admin-friendly RLS policies
CREATE POLICY "Admins can view all photos" ON photos
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert photos" ON photos
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update photos" ON photos
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete photos" ON photos
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Step 4: Verify photos table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'photos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 5: Check if photos table exists, create if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'photos' 
    AND table_schema = 'public'
  ) THEN
    CREATE TABLE photos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      file_name TEXT NOT NULL,
      folder TEXT NOT NULL,
      public_url TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      file_size BIGINT,
      mime_type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES auth.users(id)
    );
  END IF;
END $$;

-- Step 6: Add missing columns if needed
DO $$
BEGIN
  -- Add storage_path column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'photos' 
    AND column_name = 'storage_path'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE photos ADD COLUMN storage_path TEXT;
  END IF;

  -- Add file_size column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'photos' 
    AND column_name = 'file_size'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE photos ADD COLUMN file_size BIGINT;
  END IF;

  -- Add mime_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'photos' 
    AND column_name = 'mime_type'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE photos ADD COLUMN mime_type TEXT;
  END IF;

  -- Add created_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'photos' 
    AND column_name = 'created_by'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE photos ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- =====================================================
-- PHOTOS RLS POLICIES FIXED
-- =====================================================
-- The photos section should now work properly with sync functionality
