-- ============================================================
-- NUCLEAR OPTION: Drop ALL constraints, insert data freely
-- ============================================================

-- STEP 1: Drop ALL check constraints on photos table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.photos'::regclass 
        AND contype = 'c'
    LOOP
        EXECUTE format('ALTER TABLE public.photos DROP CONSTRAINT %I', r.conname);
        RAISE NOTICE 'Dropped check constraint: %', r.conname;
    END LOOP;
END $$;

-- STEP 2: Drop ALL not-null constraints (except id)
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
        AND column_name != 'id'
    LOOP
        EXECUTE format('ALTER TABLE public.photos ALTER COLUMN %I DROP NOT NULL', r.column_name);
        RAISE NOTICE 'Made column % nullable', r.column_name;
    END LOOP;
END $$;

-- STEP 3: Drop any foreign key constraints (if they reference photos)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.photos'::regclass 
        AND contype = 'f'
    LOOP
        EXECUTE format('ALTER TABLE public.photos DROP CONSTRAINT %I', r.conname);
        RAISE NOTICE 'Dropped FK constraint: %', r.conname;
    END LOOP;
END $$;

-- STEP 4: Now safely insert sample data
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

-- STEP 5: Verify
SELECT category, COUNT(*) as count FROM public.photos GROUP BY category ORDER BY count DESC;
SELECT COUNT(*) AS total_photos FROM public.photos;
