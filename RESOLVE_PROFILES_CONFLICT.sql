-- ========================================
-- RESOLVE PROFILES TABLE CONFLICT
-- ========================================
-- This script handles the case where profiles table exists but has different structure

-- First, let's check what columns the profiles table currently has
-- Then add missing columns or update structure to match what's expected

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND table_schema = 'public'
        AND column_name = 'role'
    ) THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT ''user''';
    END IF;

    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public'
            AND column_name = 'is_active'
    ) THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true';
    END IF;

    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public'
            AND column_name = 'last_login'
    ) THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public'
            AND column_name = 'created_at'
    ) THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public'
            AND column_name = 'updated_at'
    ) THEN
        EXECUTE 'ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
    END IF;

    -- Update existing records to have proper role and is_active values
    UPDATE profiles SET 
        role = CASE 
            WHEN role IS NULL OR role = '' THEN 'user'
            WHEN role NOT IN ('user', 'admin', 'super_admin') THEN 'user'
            ELSE role
        END,
        is_active = CASE 
            WHEN is_active IS NULL THEN true
            ELSE is_active
        END,
        created_at = CASE 
            WHEN created_at IS NULL THEN NOW()
            ELSE created_at
        END,
        updated_at = CASE 
            WHEN updated_at IS NULL THEN NOW()
            ELSE updated_at
        END
    WHERE role NOT IN ('user', 'admin', 'super_admin') OR role IS NULL OR role = '';

    -- Insert admin user if it doesn't exist
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
