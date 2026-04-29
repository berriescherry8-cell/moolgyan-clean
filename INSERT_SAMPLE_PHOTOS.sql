-- ============================================================
-- INSERT SAMPLE PHOTOS FOR TESTING
-- Run this in Supabase SQL Editor
-- Uses picsum.photos for placeholder images
-- ============================================================

INSERT INTO public.photos (title, description, category, folder, image_url, thumbnail_url, is_active, sort_order)
VALUES 
    -- Satsang category
    ('Morning Satsang', 'Beautiful morning satsang session', 'satsang', 'satsang', 'https://picsum.photos/800/600?random=1', 'https://picsum.photos/400/300?random=1', true, 1),
    ('Evening Kirtan', 'Evening devotional kirtan gathering', 'satsang', 'satsang', 'https://picsum.photos/800/600?random=2', 'https://picsum.photos/400/300?random=2', true, 2),
    ('Guru Purnima Event', 'Special Guru Purnima celebration', 'satsang', 'satsang', 'https://picsum.photos/800/600?random=3', 'https://picsum.photos/400/300?random=3', true, 3),
    
    -- Prachar category
    ('Delhi Prachar Yatra', 'Spiritual journey to Delhi', 'prachar', 'prachar', 'https://picsum.photos/800/600?random=4', 'https://picsum.photos/400/300?random=4', true, 1),
    ('Mumbai Satsang Tour', 'Mumbai city satsang program', 'prachar', 'prachar', 'https://picsum.photos/800/600?random=5', 'https://picsum.photos/400/300?random=5', true, 2),
    ('Village Outreach', 'Rural area spiritual outreach', 'prachar', 'prachar', 'https://picsum.photos/800/600?random=6', 'https://picsum.photos/400/300?random=6', true, 3),
    
    -- Events category
    ('Annual Gathering 2024', 'Yearly community gathering', 'events', 'events', 'https://picsum.photos/800/600?random=7', 'https://picsum.photos/400/300?random=7', true, 1),
    ('Diwali Celebration', 'Festival of lights celebration', 'events', 'events', 'https://picsum.photos/800/600?random=8', 'https://picsum.photos/400/300?random=8', true, 2),
    
    -- General category
    ('Temple Visit', 'Visit to local temple', 'general', 'general', 'https://picsum.photos/800/600?random=9', 'https://picsum.photos/400/300?random=9', true, 1),
    ('Meditation Hall', 'Peaceful meditation space', 'general', 'general', 'https://picsum.photos/800/600?random=10', 'https://picsum.photos/400/300?random=10', true, 2),
    
    -- Deeksha category
    ('Deeksha Ceremony', 'New disciple initiation ceremony', 'deeksha', 'deeksha', 'https://picsum.photos/800/600?random=11', 'https://picsum.photos/400/300?random=11', true, 1),
    
    -- Videsh category
    ('USA Tour', 'Spiritual tour in United States', 'videsh', 'videsh', 'https://picsum.photos/800/600?random=12', 'https://picsum.photos/400/300?random=12', true, 1),
    ('UK Satsang', 'Satsang program in London', 'videsh', 'videsh', 'https://picsum.photos/800/600?random=13', 'https://picsum.photos/400/300?random=13', true, 2)

ON CONFLICT DO NOTHING;

-- Verify the insert
SELECT category, COUNT(*) as count FROM public.photos GROUP BY category ORDER BY count DESC;

-- Show total
SELECT COUNT(*) AS "total_photos" FROM public.photos;
