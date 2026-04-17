-- Test Supabase Connection and Authentication
-- Run these commands in your Supabase SQL Editor

-- 1. Check if auth schema exists
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'auth';

-- 2. Check auth tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 3. Check existing users
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Test profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check if admin emails exist in profiles
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- 6. Test creating a test user (if needed)
-- INSERT INTO auth.users (id, email, email_confirmed_at) 
-- VALUES (gen_random_uuid(), 'test@example.com', NOW());

-- 7. Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 8. Test Supabase functions
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%auth%' 
LIMIT 10;
