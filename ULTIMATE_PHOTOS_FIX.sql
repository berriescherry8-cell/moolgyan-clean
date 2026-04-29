-- ============================================================
-- ULTIMATE PHOTOS TABLE FIX - Makes ALL columns nullable, inserts data
-- ============================================================

-- STEP 1: Dynamically drop ALL NOT NULL constraints on photos table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'photos' 
        AND is_nullable = 'NO'
        AND column_name != 'id'  -- Keep id NOT NULL (it's PK)
    LOOP
        EXECUTE format('ALTER TABLE public.photos ALTER COLUMN %I DROP NOT NULL', r.column_name);
        RAISE NOTICE 'Made column % nullable', r.column_name;
    END LOOP;
END $$;

-- STEP 2: Set default values for key columns to prevent future issues
ALTER TABLE public.photos ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE public.photos ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE public.photos ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE public.photos ALTER COLUMN updated_at SET DEFAULT NOW();

-- STEP 3: Insert sample data (ONLY the columns we know exist + new ones)
-- Using a safe insert that sets ALL known columns
INSERT INTO public.photos 
    (title, description, category, folder, storage_section, image_url, thumbnail_url, file_url, is_active, sort_order)
VALUES 
    ('Morning Satsang', 'Beautiful morning satsang session', 'satsang', 'satsang', 'satsang', 
     'https://picsum.photos/800/600?random=1', 'https://picsum.photos/400/300?random=1', 
     'https://picsum.photos/800/600?random=1', true, 1),
     
    ('Evening Kirtan', 'Evening devotional kirtan gathering', 'satsang', 'satsang', 'satsang', 
     'https://picsum.photos/800/600?random=2', 'https://picsum.photos/400/300?random=2', 
     'https://picsum.photos/800/600?random=2', true, 2),
     
    ('Guru Purnima Event', 'Special Guru Purnima celebration', 'satsang', 'satsang', 'satsang', 
     'https://picsum.photos/800/600?random=3', 'https://picsum.photos/400/300?random=3', 
     'https://picsum.photos/800/600?random=3', true, 3),
     
    ('Delhi Prachar Yatra', 'Spiritual journey to Delhi', 'prachar', 'prachar', 'prachar', 
     'https://picsum.photos/800/600?random=4', 'https://picsum.photos/400/300?random=4', 
     'https://picsum.photos/800/600?random=4', true, 1),
     
    ('Mumbai Satsang Tour', 'Mumbai city satsang program', 'prachar', 'prachar', 'prachar', 
     'https://picsum.photos/800/600?random=5', 'https://picsum.photos/400/300?random=5', 
     'https://picsum.photos/800/600?random=5', true, 2),
     
    ('Village Outreach', 'Rural area spiritual outreach', 'prachar', 'prachar', 'prachar', 
     'https://picsum.photos/800/600?random=6', 'https://picsum.photos/400/300?random=6', 
     'https://picsum.photos/800/600?random=6', true, 3),
     
    ('Annual Gathering 2024', 'Yearly community gathering', 'events', 'events', 'events', 
     'https://picsum.photos/800/600?random=7', 'https://picsum.photos/400/300?random=7', 
     'https://picsum.photos/800/600?random=7', true, 1),
     
    ('Diwali Celebration', 'Festival of lights celebration', 'events', 'events', 'events', 
     'https://picsum.photos/800/600?random=8', 'https://picsum.photos/400/300?random=8', 
     'https://picsum.photos/800/600?random=8', true, 2),
     
    ('Temple Visit', 'Visit to local temple', 'general', 'general', 'general', 
     'https://picsum.photos/800/600?random=9', 'https://picsum.photos/400/300?random=9', 
     'https://picsum.photos/800/600?random=9', true, 1),
     
    ('Meditation Hall', 'Peaceful meditation space', 'general', 'general', 'general', 
     'https://picsum.photos/800/600?random=10', 'https://picsum.photos/400/300?random=10', 
     'https://picsum.photos/800/600?random=10', true, 2),
     
    ('Deeksha Ceremony', 'New disciple initiation ceremony', 'deeksha', 'deeksha', 'deeksha', 
     'https://picsum.photos/800/600?random=11', 'https://picsum.photos/400/300?random=11', 
     'https://picsum.photos/800/600?random=11', true, 1),
     
    ('USA Tour', 'Spiritual tour in United States', 'videsh', 'videsh', 'videsh', 
     'https://picsum.photos/800/600?random=12', 'https://picsum.photos/400/300?random=12', 
     'https://picsum.photos/800/600?random=12', true, 1),
     
    ('UK Satsang', 'Satsang program in London', 'videsh', 'videsh', 'videsh', 
     'https://picsum.photos/800/600?random=13', 'https://picsum.photos/400/300?random=13', 
     'https://picsum.photos/800/600?random=13', true, 2)

ON CONFLICT DO NOTHING;

-- STEP 4: Verify results
SELECT category, COUNT(*) as count 
FROM public.photos 
GROUP BY category 
ORDER BY count DESC;

-- Total count
SELECT COUNT(*) AS total_photos FROM public.photos;

-- Show all columns in table (for your reference)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'photos'
ORDER BY ordinal_position;
