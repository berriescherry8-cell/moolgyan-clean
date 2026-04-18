-- =====================================================
-- CREATE ADMIN USERS WITH SECURE AUTHENTICATION
-- =====================================================
-- Run this script AFTER running SETUP_NEW_ADMIN_SYSTEM_FIXED.sql

-- Insert admin users with their passwords
-- These will be the new admin accounts with enhanced security

-- Admin 1: Devendra Sharma
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'sharmadevendra715@gmail.com',
  crypt('Ernashdev@7886', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Devendra Sharma", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Admin 2: Kapil Deora
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'kpdeora1986@gmail.com',
  crypt('Ernashkapil@1245', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Kapil Deora", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Admin 3: Sunita (Berries Cherry)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'berriescherry8@gmail.com',
  crypt('Sunita@kapil7886', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Sunita", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Create profiles for admin users (will be created by trigger, but let's ensure they exist)
INSERT INTO profiles (id, email, full_name, role, admin_permissions)
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
    'can_manage_settings', true
  )
FROM auth.users u
WHERE u.email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com')
AND NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);

-- Set up admin permissions and security settings
UPDATE profiles 
SET 
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
WHERE p.email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com');

-- Create a function to verify admin credentials securely
CREATE OR REPLACE FUNCTION verify_admin_credentials(p_email TEXT, p_password TEXT)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  is_valid BOOLEAN := false;
  session_token TEXT;
BEGIN
  -- Check if account is locked
  SELECT * INTO user_record 
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE p.email = p_email 
  AND p.role = 'admin'
  AND p.is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Admin account not found or inactive');
  END IF;
  
  IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
    RETURN json_build_object('success', false, 'error', 'Account temporarily locked due to failed login attempts');
  END IF;
  
  -- Verify password
  IF u.encrypted_password = crypt(p_password, u.encrypted_password) THEN
    is_valid := true;
    session_token := encode(sha256(p_email || NOW()::text || random()::text), 'hex');
    
    -- Create admin session
    INSERT INTO admin_sessions (user_id, session_token)
    VALUES (user_record.id, session_token);
    
    -- Update last login
    UPDATE profiles 
    SET last_login = NOW(), login_attempts = 0, locked_until = NULL
    WHERE id = user_record.id;
    
    -- Log successful login
    INSERT INTO admin_activity_log (user_id, action, details)
    VALUES (user_record.id, 'LOGIN_SUCCESS', json_build_object('email', p_email));
    
    RETURN json_build_object(
      'success', true,
      'user_id', user_record.id,
      'email', user_record.email,
      'full_name', user_record.full_name,
      'role', user_record.role,
      'session_token', session_token
    );
  ELSE
    -- Log failed attempt
    UPDATE profiles 
    SET login_attempts = login_attempts + 1,
        locked_until = CASE 
          WHEN login_attempts >= 4 THEN NOW() + INTERVAL '30 minutes'
          ELSE NULL
        END
    WHERE id = user_record.id;
    
    INSERT INTO admin_activity_log (user_id, action, details)
    VALUES (user_record.id, 'LOGIN_FAILED', json_build_object('email', p_email, 'attempts', user_record.login_attempts + 1));
    
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for secure password reset
CREATE OR REPLACE FUNCTION create_password_reset_request(p_email TEXT)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  reset_token TEXT;
BEGIN
  -- Check if admin exists
  SELECT * INTO user_record 
  FROM profiles p
  WHERE p.email = p_email 
  AND p.role = 'admin'
  AND p.is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Admin account not found');
  END IF;
  
  -- Generate reset token
  reset_token := encode(sha256(p_email || NOW()::text || random()::text), 'hex');
  
  -- Create reset request
  INSERT INTO password_reset_requests (email, token)
  VALUES (p_email, reset_token);
  
  -- Log password reset request
  INSERT INTO admin_activity_log (user_id, action, details)
  VALUES (user_record.id, 'PASSWORD_RESET_REQUESTED', json_build_object('email', p_email));
  
  RETURN json_build_object(
    'success', true,
    'reset_token', reset_token,
    'expires_at', NOW() + INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset password with token
CREATE OR REPLACE FUNCTION reset_password_with_token(p_token TEXT, p_new_password TEXT)
RETURNS JSON AS $$
DECLARE
  reset_record RECORD;
  user_id UUID;
BEGIN
  -- Find valid reset token
  SELECT * INTO reset_record
  FROM password_reset_requests pr
  WHERE pr.token = p_token
  AND pr.used = false
  AND pr.expires_at > NOW();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired reset token');
  END IF;
  
  -- Get user ID
  SELECT id INTO user_id
  FROM profiles
  WHERE email = reset_record.email;
  
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Update password
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Mark token as used
  UPDATE password_reset_requests
  SET used = true
  WHERE token = p_token;
  
  -- Log password reset
  INSERT INTO admin_activity_log (user_id, action, details)
  VALUES (user_id, 'PASSWORD_RESET_COMPLETED', json_build_object('email', reset_record.email));
  
  RETURN json_build_object('success', true, 'message', 'Password reset successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ADMIN USERS CREATED SUCCESSFULLY
-- =====================================================
-- Admin credentials:
-- 1. sharmadevendra715@gmail.com / Ernashdev@7886
-- 2. kpdeora1986@gmail.com / Ernashkapil@1245  
-- 3. berriescherry8@gmail.com / Sunita@kapil7886

-- Now run the CREATE_RLS_POLICIES_FIXED.sql script
