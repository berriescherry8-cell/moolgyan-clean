-- =====================================================
-- FIX ADMIN AUTHENTICATION ISSUE
-- =====================================================
-- This script fixes the admin login by ensuring proper auth setup

-- First, let's check what users currently exist in auth.users
SELECT email, created_at, email_confirmed_at FROM auth.users WHERE email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- The issue is that we can't directly create auth users with SQL
-- Instead, let's create a simple approach:
-- 1. Clear any existing problematic profiles
-- 2. Use the Supabase Auth signup through the frontend
-- 3. Then update their profiles to admin role

-- Clean up any existing profiles that might be causing conflicts
DELETE FROM profiles WHERE email IN (
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com', 
  'berriescherry8@gmail.com'
);

-- Create a temporary function to handle admin signup
CREATE OR REPLACE FUNCTION create_admin_user(email_param TEXT, password_param TEXT, full_name_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
BEGIN
  -- This function will be called from the frontend after signup
  -- For now, let's just ensure the structure is ready
  
  -- Check if user exists in auth.users (should be created via frontend signup)
  SELECT id INTO user_id FROM auth.users WHERE email = email_param;
  
  IF user_id IS NOT NULL THEN
    -- Create admin profile
    INSERT INTO profiles (id, email, full_name, role, admin_permissions, is_active)
    VALUES (
      user_id,
      email_param,
      full_name_param,
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
    );
    
    -- Log creation
    INSERT INTO admin_activity_log (user_id, action, details)
    VALUES (
      user_id,
      'ADMIN_ACCOUNT_CREATED',
      json_build_object('email', email_param, 'role', 'admin')
    );
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative approach: Create admin users manually using the admin UI
-- Let's create a simple signup approach

-- For now, let's create a test user to verify the system works
-- This will be removed after testing

-- =====================================================
-- INSTRUCTIONS FOR FRONTEND SETUP
-- =====================================================
-- 1. Go to the admin login page
-- 2. Click "Sign Up" or use the signup functionality
-- 3. Create accounts with these emails:
--    - sharmadevendra715@gmail.com / Ernashdev@7886
--    - kpdeora1986@gmail.com / Ernashkapil@1245
--    - berriescherry8@gmail.com / Sunita@kapil7886
-- 4. After signup, run this SQL to upgrade them to admin:

-- UPDATE profiles 
-- SET role = 'admin',
--     admin_permissions = json_build_object(
--       'can_manage_users', true,
--       'can_manage_content', true,
--       'can_manage_orders', true,
--       'can_view_analytics', true,
--       'can_manage_settings', true,
--       'can_manage_admins', true,
--       'can_view_logs', true,
--       'can_export_data', true
--     )
-- WHERE email IN (
--   'sharmadevendra715@gmail.com',
--   'kpdeora1986@gmail.com', 
--   'berriescherry8@gmail.com'
-- );

-- =====================================================
-- TEMPORARY SOLUTION
-- =====================================================
-- Let's create a simple admin user that we can test with

-- Check if we have any users at all
SELECT COUNT(*) as total_users FROM auth.users;

-- If no users exist, we need to create them through the Supabase dashboard
-- or through the frontend signup process

-- For now, let's modify the login to be more permissive for testing
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For testing, let's check if the user exists and has an admin profile
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- NEXT STEPS
-- =====================================================
-- 1. Run this SQL script
-- 2. Go to your Supabase dashboard
-- 3. Go to Authentication > Users
-- 4. Manually create the 3 admin users with their emails and passwords
-- 5. Then run the UPDATE query above to set their roles to admin
