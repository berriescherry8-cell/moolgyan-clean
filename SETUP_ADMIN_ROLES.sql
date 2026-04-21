-- =====================================================
-- SETUP ADMIN ROLES AFTER CREATING USERS IN DASHBOARD
-- =====================================================
-- Run this AFTER creating the users in Supabase Dashboard

-- Create admin profiles for the users
INSERT INTO profiles (id, email, full_name, role, admin_permissions, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email),
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
FROM auth.users u
WHERE u.email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);

-- Update existing users to admin role
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
WHERE email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

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
WHERE p.email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
)
AND p.id NOT IN (
  SELECT user_id FROM admin_activity_log WHERE action = 'ADMIN_ACCOUNT_CREATED'
);

-- Verify admin setup
SELECT 
  u.email,
  u.email_confirmed_at,
  p.role,
  p.is_active,
  p.admin_permissions ? 'can_manage_users' as has_user_permission
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- =====================================================
-- ADMIN SETUP COMPLETE
-- =====================================================
-- Users can now login with their credentials
