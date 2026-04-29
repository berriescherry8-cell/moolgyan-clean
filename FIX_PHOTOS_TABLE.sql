-- ============================================================
-- FIX PHOTOS TABLE - Handle storage_section and other issues
-- ============================================================

-- STEP 1: Show actual table structure (for reference)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'photos'
ORDER BY ordinal_position;

-- STEP 2: Make storage_section nullable (or add default)
-- Option A: Make it nullable (recommended)
ALTER TABLE public.photos ALTER COLUMN storage_section DROP NOT NULL;

-- Option B: Add a default value (uncomment if you prefer)
-- ALTER TABLE public.photos ALTER COLUMN storage_section SET DEFAULT 'general';

-- STEP 3: Also fix any other NOT NULL columns that might cause issues
-- Make 'category' nullable if it's NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'photos' 
        AND column_name = 'category' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.photos ALTER COLUMN category DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'photos' 
        AND column_name = 'folder' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.photos ALTER COLUMN folder DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'photos' 
        AND column_name = 'image_url' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.photos ALTER COLUMN image_url DROP NOT NULL;
    END IF;
END $$;

-- STEP 4: Verify the fix
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'photos'
ORDER BY ordinal_position;
