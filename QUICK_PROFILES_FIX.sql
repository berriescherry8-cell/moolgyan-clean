-- ========================================
-- QUICK FIX FOR PROFILES TABLE CONFLICT
-- ========================================
-- This script will ensure profiles table has the correct structure for admin section

-- Check if profiles table exists and has the required columns
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' AND column_name = 'role') THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT ''user'' CHECK (role IN (''user'', ''admin'', ''super_admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' AND column_name = 'is_active') THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' AND column_name = 'last_login') THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' AND column_name = 'created_at') THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' AND column_name = 'updated_at') THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
    END IF;

    -- Ensure admin user exists
    INSERT INTO profiles (id, email, full_name, role, is_active, created_at, updated_at)
    SELECT 
        uuid_generate_v4(),
        'admin@moolgyan.com',
        'Admin User',
        'super_admin',
        true,
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM profiles WHERE email = 'admin@moolgyan.com'
    );
END $$;
