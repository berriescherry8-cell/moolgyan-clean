-- Supabase SQL Editor Prompts for Admin Panel Fixes
-- 
-- To use these queries:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste each query block below
-- 4. Run them to check and fix table structures

-- ========================================
-- 1. CHECK ALL TABLES AND COLUMNS
-- ========================================
-- Run this first to see all tables and their columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ========================================
-- 2. CHECK FOR MISSING updated_at COLUMNS
-- ========================================
-- Check which tables are missing updated_at columns
SELECT 
    table_name,
    COUNT(*) as total_columns,
    BOOL_OR(column_name = 'updated_at') as has_updated_at,
    BOOL_OR(column_name = 'created_at') as has_created_at
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs')
GROUP BY table_name;

-- ========================================
-- 3. ADD updated_at COLUMNS IF MISSING
-- ========================================
-- Add updated_at to wisdom_quotes if missing
ALTER TABLE wisdom_quotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Add updated_at to news_items if missing  
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Add updated_at to satguru_bhajan if missing
ALTER TABLE satguru_bhajan ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Add updated_at to live_satsangs if missing
ALTER TABLE live_satsangs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- ========================================
-- 4. ADD created_at COLUMNS IF MISSING
-- ========================================
-- Add created_at to wisdom_quotes if missing
ALTER TABLE wisdom_quotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Add created_at to news_items if missing
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Add created_at to satguru_bhajan if missing
ALTER TABLE satguru_bhajan ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Add created_at to live_satsangs if missing
ALTER TABLE live_satsangs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- ========================================
-- 5. CHECK ROW LEVEL SECURITY (RLS)
-- ========================================
-- Check RLS status for all tables
SELECT 
    table_name,
    is_rls_enabled
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs', 'books', 'photos')
ORDER BY table_name;

-- ========================================
-- 6. ENABLE RLS IF DISABLED
-- ========================================
-- Enable RLS for tables that need it
ALTER TABLE wisdom_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE satguru_bhajan ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_satsangs ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 7. CHECK POLICIES
-- ========================================
-- Check existing policies
SELECT 
    table_name,
    policy_name,
    policy_permissive,
    policy_cmd,
    policy_with_check
FROM pg_policy 
WHERE table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs', 'books', 'photos')
ORDER BY table_name, policy_name;

-- ========================================
-- 8. ADD BASIC POLICIES FOR ADMIN ACCESS
-- ========================================
-- Add read policy for all authenticated users
CREATE POLICY "Allow read for authenticated users" ON wisdom_quotes
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON news_items
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON satguru_bhajan
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON live_satsangs
FOR SELECT USING (auth.role() = 'authenticated');

-- Add admin policies for full access
CREATE POLICY "Allow admin full access" ON wisdom_quotes
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access" ON news_items
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access" ON satguru_bhajan
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access" ON live_satsangs
FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- 9. CHECK DATA IN TABLES
-- ========================================
-- Check if tables have data
SELECT 'wisdom_quotes' as table_name, COUNT(*) as row_count FROM wisdom_quotes
UNION ALL
SELECT 'news_items' as table_name, COUNT(*) as row_count FROM news_items
UNION ALL
SELECT 'satguru_bhajan' as table_name, COUNT(*) as row_count FROM satguru_bhajan
UNION ALL
SELECT 'live_satsangs' as table_name, COUNT(*) as row_count FROM live_satsangs
ORDER BY table_name;

-- ========================================
-- 10. CHECK FOR NULL VALUES IN REQUIRED COLUMNS
-- ========================================
-- Check for null values in critical columns
SELECT 
    'wisdom_quotes' as table_name,
    COUNT(*) as null_quotes
FROM wisdom_quotes 
WHERE quote IS NULL OR quote = '';

SELECT 
    'news_items' as table_name,
    COUNT(*) as null_titles
FROM news_items 
WHERE title IS NULL OR title = '';

SELECT 
    'satguru_bhajan' as table_name,
    COUNT(*) as null_titles
FROM satguru_bhajan 
WHERE title IS NULL OR title = '';

SELECT 
    'live_satsangs' as table_name,
    COUNT(*) as null_urls
FROM live_satsangs 
WHERE youtube_url IS NULL OR youtube_url = '';

-- ========================================
-- 11. UPDATE EXISTING ROWS WITH MISSING TIMESTAMPS
-- ========================================
-- Update existing rows with current timestamp if created_at is null
UPDATE wisdom_quotes SET created_at = NOW() WHERE created_at IS NULL;
UPDATE wisdom_quotes SET updated_at = NOW() WHERE updated_at IS NULL;

UPDATE news_items SET created_at = NOW() WHERE created_at IS NULL;
UPDATE news_items SET updated_at = NOW() WHERE updated_at IS NULL;

UPDATE satguru_bhajan SET created_at = NOW() WHERE created_at IS NULL;
UPDATE satguru_bhajan SET updated_at = NOW() WHERE updated_at IS NULL;

UPDATE live_satsangs SET created_at = NOW() WHERE created_at IS NULL;
UPDATE live_satsangs SET updated_at = NOW() WHERE updated_at IS NULL;

-- ========================================
-- 12. FINAL VERIFICATION
-- ========================================
-- Final check of table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
    AND table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs')
    AND column_name IN ('id', 'created_at', 'updated_at')
ORDER BY table_name, column_name;