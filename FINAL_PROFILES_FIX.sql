-- ========================================
-- FINAL PROFILES TABLE FIX
-- ========================================
-- This script will resolve the profiles table conflict by ensuring correct structure

-- Step 1: Check current structure and fix if needed
DO $$
BEGIN
    -- Drop and recreate profiles table to ensure correct structure
    DROP TABLE IF EXISTS profiles CASCADE;
    
    -- Recreate profiles table with correct structure
    CREATE TABLE profiles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insert admin user
    INSERT INTO profiles (id, email, full_name, role, is_active, created_at, updated_at) VALUES 
        (uuid_generate_v4(), 'admin@moolgyan.com', 'Admin User', 'super_admin', true, NOW(), NOW());

    -- Grant necessary permissions
    GRANT ALL ON profiles TO authenticated;
    GRANT ALL ON profiles TO service_role;
END $$;
