-- Run in Supabase SQL Editor
-- 1. Enable RLS on tables if not
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
-- Repeat for news, orders, etc.

-- 2. Admin policy example for books (adapt for other tables)
CREATE POLICY "Admin only on books" ON books
FOR ALL USING (
  auth.role() = 'authenticated' 
  AND auth.email() = ANY(ARRAY[
    'sharmadevendra715@gmail.com',
    'kpdeora1986@gmail.com',
    'berriescherry8@gmail.com'
  ]::text[])
);

-- 3. Create admin users (passwords hashed with Supabase format, use dashboard or service key API)
-- Use Supabase dashboard Auth > Users > Add user manually with emails/passwords:
-- Ernashdev@7886, Ernashkapil@1245, Sunita@kapil7886
-- Or via service role client:
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'sharmadevendra715@gmail.com',
  crypt('Ernashdev@7886', gen_salt('bf')),
  now(),
  now(),
  now()
);
-- Repeat for other 2, confirm email if needed.

-- Verify policies:
SELECT * FROM pg_policies WHERE tablename = 'books';
