-- ============================================================
-- PHOTOS TABLE DIAGNOSTIC & FIX SCRIPT
-- Run this in your Supabase SQL Editor
-- ============================================================

-- STEP 1: Check if the photos table exists
SELECT 
    EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'photos'
    ) AS "photos_table_exists";

-- STEP 2: If table exists, show all columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'photos'
ORDER BY ordinal_position;

-- STEP 3: If table exists, show sample data (first 5 rows)
-- (Uncomment if table exists)
-- SELECT * FROM photos LIMIT 5;

-- STEP 4: If table exists, show row count
-- SELECT COUNT(*) AS total_photos FROM photos;

-- ============================================================
-- STEP 5: CREATE TABLE if it does NOT exist
-- ============================================================
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT '',
    description TEXT,
    category TEXT DEFAULT 'general',
    folder TEXT DEFAULT 'general',
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size BIGINT,
    file_type TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 6: ADD missing columns if table already exists but lacks fields
-- ============================================================
DO $$
BEGIN
    -- Add title if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'title') THEN
        ALTER TABLE public.photos ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add description if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'description') THEN
        ALTER TABLE public.photos ADD COLUMN description TEXT;
    END IF;

    -- Add category if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'category') THEN
        ALTER TABLE public.photos ADD COLUMN category TEXT DEFAULT 'general';
    END IF;

    -- Add folder if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'folder') THEN
        ALTER TABLE public.photos ADD COLUMN folder TEXT DEFAULT 'general';
    END IF;

    -- Add image_url if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'image_url') THEN
        ALTER TABLE public.photos ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add thumbnail_url if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE public.photos ADD COLUMN thumbnail_url TEXT;
    END IF;

    -- Add file_size if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'file_size') THEN
        ALTER TABLE public.photos ADD COLUMN file_size BIGINT;
    END IF;

    -- Add file_type if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'file_type') THEN
        ALTER TABLE public.photos ADD COLUMN file_type TEXT;
    END IF;

    -- Add is_active if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'is_active') THEN
        ALTER TABLE public.photos ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Add sort_order if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'sort_order') THEN
        ALTER TABLE public.photos ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'created_at') THEN
        ALTER TABLE public.photos ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add updated_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'photos' AND column_name = 'updated_at') THEN
        ALTER TABLE public.photos ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ============================================================
-- STEP 7: Enable Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 8: Create RLS policies for public read access
-- ============================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON public.photos;
DROP POLICY IF EXISTS "Allow public select" ON public.photos;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.photos;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.photos;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.photos;

-- Allow anyone to read photos
CREATE POLICY "Allow public read access"
ON public.photos
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
ON public.photos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update"
ON public.photos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete"
ON public.photos
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- STEP 9: Grant permissions
-- ============================================================
GRANT ALL ON public.photos TO authenticated;
GRANT SELECT ON public.photos TO anon;

-- ============================================================
-- STEP 10: Insert sample data (optional - for testing)
-- Uncomment if you want test data
-- ============================================================
/*
INSERT INTO public.photos (title, category, folder, image_url, thumbnail_url, is_active)
VALUES 
    ('Sample Satsang Photo 1', 'satsang', 'satsang', 'https://picsum.photos/800/600?random=1', 'https://picsum.photos/400/300?random=1', true),
    ('Sample Event Photo 1', 'events', 'events', 'https://picsum.photos/800/600?random=2', 'https://picsum.photos/400/300?random=2', true),
    ('Sample Prachar Photo 1', 'prachar', 'prachar', 'https://picsum.photos/800/600?random=3', 'https://picsum.photos/400/300?random=3', true),
    ('Sample General Photo 1', 'general', 'general', 'https://picsum.photos/800/600?random=4', 'https://picsum.photos/400/300?random=4', true)
ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- STEP 11: Verify final table structure
-- ============================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'photos'
ORDER BY ordinal_position;

-- Show total count
SELECT COUNT(*) AS "total_photos_in_table" FROM public.photos;
