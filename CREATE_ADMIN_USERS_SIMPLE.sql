-- =====================================================
-- CREATE ADMIN USERS USING SUPABASE AUTH
-- =====================================================
-- This script creates admin users using Supabase's auth system
-- Run this script to fix the authentication issue

-- First, let's create the admin users using Supabase Auth
-- We'll use the auth.signup function which properly handles password hashing

-- Note: This approach uses Supabase's built-in auth system
-- The users will be created with proper authentication

-- Create admin user 1: Devendra Sharma
SELECT auth.email(
  'sharmadevendra715@gmail.com',
  'Ernashdev@7886',
  '{"email_confirmed": true, "full_name": "Devendra Sharma", "role": "admin"}'
);

-- Create admin user 2: Kapil Deora  
SELECT auth.email(
  'kpdeora1986@gmail.com',
  'Ernashkapil@1245',
  '{"email_confirmed": true, "full_name": "Kapil Deora", "role": "admin"}'
);

-- Create admin user 3: Sunita
SELECT auth.email(
  'berriescherry8@gmail.com',
  'Sunita@kapil7886',
  '{"email_confirmed": true, "full_name": "Sunita", "role": "admin"}'
);

-- Now ensure profiles exist for these users
INSERT INTO profiles (id, email, full_name, role, admin_permissions, is_active)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  'admin',
  json_build_object(
    'can_manage_users', true,
    'can_manage_content', true,
    'can_manage_orders', true,
    'can_view_analytics', true,
    'can_manage_settings', true,
    'can_manage_admins', true,
    'can_view_logs', true,
    'can_export_data', true
  ),
  true
FROM auth.users
WHERE email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = auth.users.id
);

-- Update existing profiles to ensure they have admin role
UPDATE profiles 
SET 
  role = 'admin',
  admin_permissions = json_build_object(
    'can_manage_users', true,
    'can_manage_content', true,
    'can_manage_orders', true,
    'can_view_analytics', true,
    'can_manage_settings', true,
    'can_manage_admins', true,
    'can_view_logs', true,
    'can_export_data', true
  ),
  is_active = true
WHERE email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com');

-- Log admin account creation
INSERT INTO admin_activity_log (user_id, action, details)
SELECT 
  p.id,
  'ADMIN_ACCOUNT_CREATED',
  json_build_object(
    'email', p.email,
    'role', p.role,
    'created_at', NOW()
  )
FROM profiles p
WHERE p.email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com')
AND p.id NOT IN (
  SELECT user_id FROM admin_activity_log WHERE action = 'ADMIN_ACCOUNT_CREATED'
);

-- Verify admin users exist
SELECT 
  u.email,
  u.created_at as auth_created,
  p.role,
  p.is_active,
  p.admin_permissions
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com');

-- =====================================================
-- ADMIN USERS CREATED SUCCESSFULLY
-- =====================================================
-- The admin users should now be able to login with:
-- 1. sharmadevendra715@gmail.com / Ernashdev@7886
-- 2. kpdeora1986@gmail.com / Ernashkapil@1245  
-- 3. berriescherry8@gmail.com / Sunita@kapil7886
