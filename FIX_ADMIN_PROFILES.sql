-- ============================================
-- FIX ADMIN PROFILES TABLE + SET ADMIN ROLE
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor → New query

-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text DEFAULT 'user',
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- 4. Create policies
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. Set your user as admin (replace with your actual UUID if different)
-- Your UUID from the console logs: 8e7720b7-5411-4513-bc6f-2b6678a59659
-- Pull email from auth.users to satisfy NOT NULL constraint
INSERT INTO public.profiles (id, role, full_name, email, created_at, updated_at)
SELECT 
    '8e7720b7-5411-4513-bc6f-2b6678a59659',
    'admin',
    'Admin User',
    email,
    now(),
    now()
FROM auth.users
WHERE id = '8e7720b7-5411-4513-bc6f-2b6678a59659'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = now();

-- 6. Also update auth.users metadata to ensure fallback works
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = '8e7720b7-5411-4513-bc6f-2b6678a59659';

-- 7. Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_app_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES (run these to check)
-- ============================================

-- Check your profile
SELECT * FROM public.profiles WHERE id = '8e7720b7-5411-4513-bc6f-2b6678a59659';

-- Check your auth metadata
SELECT id, email, raw_app_meta_data->>'role' as role FROM auth.users WHERE id = '8e7720b7-5411-4513-bc6f-2b6678a59659';

-- List all admin users
SELECT p.id, p.role, u.email 
FROM public.profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.role = 'admin';

