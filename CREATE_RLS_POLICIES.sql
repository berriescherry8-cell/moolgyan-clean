-- =====================================================
-- COMPREHENSIVE RLS POLICIES FOR ADMIN PROTECTION
-- =====================================================
-- Run this script AFTER running CREATE_ADMIN_USERS.sql

-- 1. Profiles Table Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (with restrictions)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id AND 
    (role != 'admin' OR (role = 'admin' AND 
      -- Allow admins to update only safe fields
      (jsonb_extract_path(NEW, 'full_name') IS NOT NULL OR
       jsonb_extract_path(NEW, 'avatar_url') IS NOT NULL OR
       jsonb_extract_path(NEW, 'phone') IS NOT NULL OR
       jsonb_extract_path(NEW, 'address') IS NOT NULL))));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 2. Orders Table Policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can insert, update, delete orders
CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 3. Books Table Policies
-- Public can view all books
CREATE POLICY "Public can view books" ON books
  FOR SELECT USING (published = true);

-- Admins can view all books (including drafts)
CREATE POLICY "Admins can view all books" ON books
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage books
CREATE POLICY "Admins can manage books" ON books
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 4. Photos Table Policies
-- Public can view all photos
CREATE POLICY "Public can view photos" ON photos
  FOR SELECT USING (published = true);

-- Admins can view all photos
CREATE POLICY "Admins can view all photos" ON photos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage photos
CREATE POLICY "Admins can manage photos" ON photos
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 5. Videos Table Policies
-- Public can view all videos
CREATE POLICY "Public can view videos" ON videos
  FOR SELECT USING (published = true);

-- Admins can view all videos
CREATE POLICY "Admins can view all videos" ON videos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage videos
CREATE POLICY "Admins can manage videos" ON videos
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 6. News Table Policies
-- Public can view published news
CREATE POLICY "Public can view news" ON news
  FOR SELECT USING (published = true);

-- Admins can view all news
CREATE POLICY "Admins can view all news" ON news
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage news
CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 7. Wisdom Quotes Table Policies
-- Public can view published quotes
CREATE POLICY "Public can view wisdom quotes" ON wisdom_quotes
  FOR SELECT USING (published = true);

-- Admins can view all quotes
CREATE POLICY "Admins can view all wisdom quotes" ON wisdom_quotes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage quotes
CREATE POLICY "Admins can manage wisdom quotes" ON wisdom_quotes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 8. Deeksha Aavedan Table Policies
-- Users can view their own deeksha requests
CREATE POLICY "Users can view own deeksha" ON deeksha_aavedan
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all deeksha requests
CREATE POLICY "Admins can view all deeksha" ON deeksha_aavedan
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage deeksha requests
CREATE POLICY "Admins can manage deeksha" ON deeksha_aavedan
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 9. Feedback Table Policies
-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- Admins can manage feedback
CREATE POLICY "Admins can manage feedback" ON feedback
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- 10. Admin Sessions Table Policies (Super Restricted)
-- Users can only view their own sessions
CREATE POLICY "Users can view own admin sessions" ON admin_sessions
  FOR SELECT USING (user_id = auth.uid());

-- Users can only insert their own sessions
CREATE POLICY "Users can insert own admin sessions" ON admin_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can only update their own sessions
CREATE POLICY "Users can update own admin sessions" ON admin_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- Users can only delete their own sessions
CREATE POLICY "Users can delete own admin sessions" ON admin_sessions
  FOR DELETE USING (user_id = auth.uid());

-- 11. Admin Activity Log Table Policies (Super Restricted)
-- Admins can view all activity logs
CREATE POLICY "Admins can view activity logs" ON admin_activity_log
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- System can insert activity logs (for triggers)
CREATE POLICY "System can insert activity logs" ON admin_activity_log
  FOR INSERT WITH CHECK (true);

-- 12. Password Reset Requests Table Policies
-- Users can view their own reset requests
CREATE POLICY "Users can view own password reset requests" ON password_reset_requests
  FOR SELECT USING (email = (
    SELECT email FROM profiles WHERE id = auth.uid()
  ));

-- Users can insert their own reset requests
CREATE POLICY "Users can insert own password reset requests" ON password_reset_requests
  FOR INSERT WITH CHECK (email = (
    SELECT email FROM profiles WHERE id = auth.uid()
  ));

-- Users can update their own reset requests
CREATE POLICY "Users can update own password reset requests" ON password_reset_requests
  FOR UPDATE USING (email = (
    SELECT email FROM profiles WHERE id = auth.uid()
  ));

-- Admins can view all reset requests
CREATE POLICY "Admins can view all password reset requests" ON password_reset_requests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
  ));

-- =====================================================
-- SECURITY FUNCTIONS FOR ENHANCED PROTECTION
-- =====================================================

-- Function to check if current user has specific admin permission
CREATE OR REPLACE FUNCTION has_admin_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
    AND p.is_active = true
    AND (p.locked_until IS NULL OR p.locked_until < NOW())
    AND p.admin_permissions ? permission_name
    AND p.admin_permissions->permission_name = 'true'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin activities automatically
CREATE OR REPLACE FUNCTION log_admin_activity(action_name TEXT, details JSONB DEFAULT '{}')
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
    AND p.is_active = true
  ) THEN
    INSERT INTO admin_activity_log (user_id, action, details)
    VALUES (auth.uid(), action_name, details);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES SETUP COMPLETE
-- =====================================================
-- All tables are now protected with comprehensive Row Level Security
-- Only authenticated users can access data based on their roles
-- Admin functions are protected with additional security checks
