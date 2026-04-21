-- =====================================================
-- COMPLETE YOUTUBE AUTOMATION SQL SETUP
-- =====================================================
-- This script sets up everything needed for YouTube automation

-- Step 1: Ensure live_satsangs table exists with all required columns
DO $$
BEGIN
  -- Create table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'live_satsangs' 
    AND table_schema = 'public'
  ) THEN
    CREATE TABLE live_satsangs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      youtube_url TEXT NOT NULL UNIQUE,
      is_live BOOLEAN DEFAULT false,
      thumbnail_url TEXT,
      channel_name TEXT,
      channel_id TEXT,
      view_count INTEGER DEFAULT 0,
      duration TEXT,
      published_at TIMESTAMP WITH TIME ZONE,
      for_sale BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES auth.users(id)
    );
    
    -- Create indexes
    CREATE INDEX idx_live_satsangs_is_live ON live_satsangs(is_live);
    CREATE INDEX idx_live_satsangs_created_at ON live_satsangs(created_at DESC);
    CREATE INDEX idx_live_satsangs_youtube_url ON live_satsangs(youtube_url);
    
    RAISE NOTICE 'Created live_satsangs table';
  END IF;
END $$;

-- Step 2: Add any missing columns to existing live_satsangs table
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
    RAISE NOTICE 'Added for_sale column';
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'created_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added created_at column';
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;

  -- Add thumbnail_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'thumbnail_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN thumbnail_url TEXT;
    RAISE NOTICE 'Added thumbnail_url column';
  END IF;

  -- Add channel_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'channel_name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN channel_name TEXT;
    RAISE NOTICE 'Added channel_name column';
  END IF;

  -- Add channel_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'channel_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN channel_id TEXT;
    RAISE NOTICE 'Added channel_id column';
  END IF;

  -- Add view_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'view_count'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN view_count INTEGER DEFAULT 0;
    RAISE NOTICE 'Added view_count column';
  END IF;

  -- Add duration column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'duration'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN duration TEXT;
    RAISE NOTICE 'Added duration column';
  END IF;

  -- Add published_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'published_at'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added published_at column';
  END IF;

  -- Add created_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_satsangs' 
    AND column_name = 'created_by'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE live_satsangs ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by column';
  END IF;
END $$;

-- Step 3: Enable RLS on live_satsangs table
ALTER TABLE live_satsangs ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Admins can view all live_satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Admins can insert live_satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Admins can update live_satsangs" ON live_satsangs;
DROP POLICY IF EXISTS "Admins can delete live_satsangs" ON live_satsangs;

-- Step 5: Create new admin-friendly RLS policies
CREATE POLICY "Admins can view all live_satsangs" ON live_satsangs
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert live_satsangs" ON live_satsangs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update live_satsangs" ON live_satsangs
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete live_satsangs" ON live_satsangs
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Step 6: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_live_satsangs_updated_at ON live_satsangs;
CREATE TRIGGER update_live_satsangs_updated_at 
    BEFORE UPDATE ON live_satsangs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create admin activity log table for tracking YouTube automation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'youtube_sync_log' 
    AND table_schema = 'public'
  ) THEN
    CREATE TABLE youtube_sync_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sync_type TEXT NOT NULL, -- 'automatic' or 'manual'
      videos_found INTEGER DEFAULT 0,
      videos_synced INTEGER DEFAULT 0,
      videos_skipped INTEGER DEFAULT 0,
      errors INTEGER DEFAULT 0,
      error_details TEXT,
      sync_duration_ms INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES auth.users(id)
    );
    
    CREATE INDEX idx_youtube_sync_log_created_at ON youtube_sync_log(created_at DESC);
    CREATE INDEX idx_youtube_sync_log_sync_type ON youtube_sync_log(sync_type);
    
    RAISE NOTICE 'Created youtube_sync_log table';
  END IF;
END $$;

-- Step 8: Enable RLS on youtube_sync_log table
ALTER TABLE youtube_sync_log ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for youtube_sync_log
DROP POLICY IF EXISTS "Admins can view youtube_sync_log" ON youtube_sync_log;
DROP POLICY IF EXISTS "Admins can insert youtube_sync_log" ON youtube_sync_log;

CREATE POLICY "Admins can view youtube_sync_log" ON youtube_sync_log
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert youtube_sync_log" ON youtube_sync_log
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Step 10: Create view for YouTube automation statistics
CREATE OR REPLACE VIEW youtube_automation_stats AS
SELECT 
  COUNT(*) as total_videos,
  COUNT(*) FILTER (WHERE is_live = true) as live_videos,
  COUNT(*) FILTER (WHERE is_live = false) as archive_videos,
  MAX(created_at) as last_sync,
  COUNT(DISTINCT channel_name) as unique_channels
FROM live_satsangs;

-- Step 11: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON live_satsangs TO authenticated;
GRANT SELECT ON youtube_sync_log TO authenticated;
GRANT SELECT ON youtube_automation_stats TO authenticated;

-- Step 12: Verify setup
SELECT 
  'live_satsangs' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'live_satsangs' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 13: Sample data for testing (optional)
DO $$
BEGIN
  -- Check if table is empty before inserting sample data
  IF (SELECT COUNT(*) FROM live_satsangs) = 0 THEN
    INSERT INTO live_satsangs (
      title,
      description,
      youtube_url,
      is_live,
      channel_name,
      view_count,
      duration
    ) VALUES 
    (
      'Sample Live Satsang',
      'This is a sample live satsang video for testing',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      true,
      '@nitin.dasssatsang',
      1000,
      '1:30:00'
    ),
    (
      'Sample Archive Video',
      'This is a sample archive video for testing',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ2',
      false,
      '@nitin-kabir-krishna-nanak-ram',
      5000,
      '2:15:00'
    );
    
    RAISE NOTICE 'Inserted sample data for testing';
  END IF;
END $$;

-- =====================================================
-- YOUTUBE AUTOMATION SETUP COMPLETE
-- =====================================================
-- The following has been set up:
-- 1. live_satsangs table with all required columns
-- 2. Proper RLS policies for admin access
-- 3. Triggers for updated_at timestamps
-- 4. youtube_sync_log table for tracking automation
-- 5. Statistics view for monitoring
-- 6. Sample data for testing

-- Next steps:
-- 1. Test manual upload via admin panel
-- 2. Test automatic sync via API endpoint
-- 3. Verify videos appear in live satsang page
-- 4. Monitor youtube_sync_log for automation tracking
