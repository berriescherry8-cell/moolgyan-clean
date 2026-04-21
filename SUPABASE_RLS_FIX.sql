-- Supabase RLS Fix for Public Read Access
-- 
-- This script fixes the issue where admin can save data but public app can't see it
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. REMOVE EXISTING RESTRICTIVE POLICIES
-- ========================================
-- First, remove any existing restrictive policies
DROP POLICY IF EXISTS "Allow read for authenticated users" ON wisdom_quotes;
DROP POLICY IF EXISTS "Allow admin full access" ON wisdom_quotes;

DROP POLICY IF EXISTS "Allow read for authenticated users" ON news_items;
DROP POLICY IF EXISTS "Allow admin full access" ON news_items;

DROP POLICY IF EXISTS "Allow read for authenticated users" ON satguru_bhajan;
DROP POLICY IF EXISTS "Allow admin full access" ON satguru_bhajan;

DROP POLICY IF EXISTS "Allow read for authenticated users" ON live_satsangs;
DROP POLICY IF EXISTS "Allow admin full access" ON live_satsangs;

-- ========================================
-- 2. ENABLE RLS ON ALL TABLES
-- ========================================
ALTER TABLE wisdom_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE satguru_bhajan ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_satsangs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. ADD PUBLIC READ POLICIES (NO AUTHENTICATION REQUIRED)
-- ========================================
-- Allow anyone to read data from these tables (public access)
CREATE POLICY "Allow public read" ON wisdom_quotes
FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON news_items
FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON satguru_bhajan
FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON live_satsangs
FOR SELECT USING (true);

-- ========================================
-- 4. ADD ADMIN WRITE POLICIES (AUTHENTICATION REQUIRED)
-- ========================================
-- Allow only authenticated users (admins) to insert/update/delete
CREATE POLICY "Allow admin insert" ON wisdom_quotes
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON wisdom_quotes
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON wisdom_quotes
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert" ON news_items
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON news_items
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON news_items
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert" ON satguru_bhajan
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON satguru_bhajan
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON satguru_bhajan
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert" ON live_satsangs
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON live_satsangs
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON live_satsangs
FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 5. VERIFY POLICIES
-- ========================================
-- Check all policies on these tables
SELECT 
    table_name,
    policy_name,
    policy_permissive,
    policy_cmd,
    policy_with_check
FROM pg_policy 
WHERE table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs')
ORDER BY table_name, policy_name;

-- ========================================
-- 6. TEST DATA ACCESS
-- ========================================
-- Test that public can read data (should return results)
SELECT COUNT(*) as wisdom_quotes_count FROM wisdom_quotes;
SELECT COUNT(*) as news_items_count FROM news_items;
SELECT COUNT(*) as satguru_bhajan_count FROM satguru_bhajan;
SELECT COUNT(*) as live_satsangs_count FROM live_satsangs;

-- ========================================
-- 7. OPTIONAL: ADD COLUMN LEVEL SECURITY
-- ========================================
-- If you want to hide certain columns from public, you can create column-level policies
-- For now, all columns are visible to public

-- ========================================
-- 8. FINAL VERIFICATION
-- ========================================
-- Verify RLS is enabled and policies are working
SELECT 
    table_name,
    is_rls_enabled
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND table_name IN ('wisdom_quotes', 'news_items', 'satguru_bhajan', 'live_satsangs')
ORDER BY table_name;