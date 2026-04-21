-- Check if users exist in Supabase auth
-- Run this in Supabase SQL Editor

-- 1. Check all users in auth.users
SELECT id, email, created_at, last_sign_in_at, email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check specifically for your admin emails
SELECT id, email, created_at, last_sign_in_at, email_confirmed_at
FROM auth.users 
WHERE email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- 3. Check if profiles match auth users
SELECT 
  u.id as auth_id,
  u.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  p.role as profile_role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- 4. If users don't exist in auth, create them (you'll need to set passwords later)
-- This is just for reference - don't run unless needed
/*
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  email,
  NOW(),
  NOW(),
  NOW()
FROM (VALUES 
  ('sharmadevendra715@gmail.com'),
  ('kpdeora1986@gmail.com'),
  ('berriescherry8@gmail.com')
) AS temp(email)
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.email = temp.email
);
*/
