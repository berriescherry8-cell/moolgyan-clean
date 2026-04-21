-- =====================================================
-- SETUP NEW SECURE ADMIN SYSTEM
-- =====================================================
-- Run this script AFTER running CLEANUP_EXISTING_AUTH.sql

-- 1. Create enhanced profiles table with admin support
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  admin_permissions JSONB DEFAULT '{}',
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- 2. Create admin sessions table for enhanced security
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 3. Create admin activity log for security monitoring
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  used BOOLEAN DEFAULT false,
  ip_address INET
);

-- 5. Enhanced indexes for performance and security
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at);
CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS admin_activity_log_user_id_idx ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS admin_activity_log_created_at_idx ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS password_reset_requests_token_idx ON password_reset_requests(token);
CREATE INDEX IF NOT EXISTS password_reset_requests_email_idx ON password_reset_requests(email);

-- 6. Create secure functions for admin authentication

-- Function to handle new user registration with automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Determine role based on email
  NEW.role := CASE 
    WHEN NEW.email IN ('sharmadevendra715@gmail.com', 'kpdeora1986@gmail.com', 'berriescherry8@gmail.com') 
    THEN 'admin' 
    ELSE 'user' 
  END;
  
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.role
  );
  
  -- Log admin registration
  IF NEW.role = 'admin' THEN
    INSERT INTO admin_activity_log (user_id, action, details)
    VALUES (
      NEW.id,
      'ADMIN_REGISTERED',
      json_build_object('email', NEW.email, 'role', NEW.role)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile with timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log admin login attempts
CREATE OR REPLACE FUNCTION log_admin_login(p_email TEXT, p_success BOOLEAN, p_ip_address INET DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  IF p_success THEN
    -- Update last login and reset login attempts
    UPDATE profiles 
    SET last_login = NOW(), 
        login_attempts = 0, 
        locked_until = NULL
    WHERE email = p_email;
    
    -- Log successful login
    INSERT INTO admin_activity_log (user_id, action, details, ip_address)
    SELECT id, 'LOGIN_SUCCESS', json_build_object('email', p_email), p_ip_address
    FROM profiles WHERE email = p_email;
  ELSE
    -- Increment login attempts and potentially lock account
    UPDATE profiles 
    SET login_attempts = login_attempts + 1,
        locked_until = CASE 
          WHEN login_attempts >= 4 THEN NOW() + INTERVAL '30 minutes'
          ELSE NULL
        END
    WHERE email = p_email;
    
    -- Log failed login
    INSERT INTO admin_activity_log (user_id, action, details, ip_address)
    SELECT id, 'LOGIN_FAILED', json_build_object('email', p_email, 'attempts', login_attempts + 1), p_ip_address
    FROM profiles WHERE email = p_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role = 'admin' 
    AND is_active = true
    AND (locked_until IS NULL OR locked_until < NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deeksha_aavedan ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Now run the CREATE_ADMIN_USERS.sql script
