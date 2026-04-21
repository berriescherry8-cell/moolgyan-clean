-- =====================================================
-- CLEANUP EXISTING AUTHENTICATION AND POLICIES
-- =====================================================
-- WARNING: This will delete ALL existing users, profiles, and policies
-- Run this script first to clean up everything before rebuilding

-- 1. Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Drop any other existing policies on other tables
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- 2. Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE deeksha_aavedan DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- 3. Drop all existing admin-related functions and triggers
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_user_profile() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;

-- 4. Clear all existing data from tables (keeping structure)
TRUNCATE TABLE profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE books RESTART IDENTITY CASCADE;
TRUNCATE TABLE photos RESTART IDENTITY CASCADE;
TRUNCATE TABLE videos RESTART IDENTITY CASCADE;
TRUNCATE TABLE news RESTART IDENTITY CASCADE;
TRUNCATE TABLE wisdom_quotes RESTART IDENTITY CASCADE;
TRUNCATE TABLE deeksha_aavedan RESTART IDENTITY CASCADE;
TRUNCATE TABLE feedback RESTART IDENTITY CASCADE;

-- 5. Delete all authentication users (this will force logout everyone)
-- WARNING: This will remove all user accounts
DELETE FROM auth.users WHERE email NOT IN (
    'sharmadevendra715@gmail.com',
    'kpdeora1986@gmail.com', 
    'berriescherry8@gmail.com'
);

-- 6. Clean up any remaining sessions
DELETE FROM auth.sessions;

-- 7. Reset sequences
ALTER TABLE profiles ALTER COLUMN id RESTART WITH 1;
ALTER TABLE orders ALTER COLUMN id RESTART WITH 1;
ALTER TABLE books ALTER COLUMN id RESTART WITH 1;
ALTER TABLE photos ALTER COLUMN id RESTART WITH 1;
ALTER TABLE videos ALTER COLUMN id RESTART WITH 1;
ALTER TABLE news ALTER COLUMN id RESTART WITH 1;
ALTER TABLE wisdom_quotes ALTER COLUMN id RESTART WITH 1;
ALTER TABLE deeksha_aavedan ALTER COLUMN id RESTART WITH 1;
ALTER TABLE feedback ALTER COLUMN id RESTART WITH 1;

-- =====================================================
-- CLEANUP COMPLETE
-- =====================================================
-- Now run the SETUP_NEW_ADMIN_SYSTEM.sql script
