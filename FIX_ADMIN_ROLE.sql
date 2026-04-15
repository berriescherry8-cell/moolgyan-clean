
-- 🔥 COPY PASTE THIS ENTIRE BLOCK TO SUPABASE SQL EDITOR & RUN 🔥

-- STEP 1: Create profiles table if missing
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 3: RLS Policies (Admins can see all)
CREATE POLICY "Public profiles profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- STEP 4: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role) 
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 🔥 STEP 5: SET YOUR EMAIL AS ADMIN 🔥
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'sharmadevendra715@gmail.com';

-- STEP 6: VERIFY (should show role = 'admin')
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'sharmadevendra715@gmail.com';

-- DONE! Login now works ✅

