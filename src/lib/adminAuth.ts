<<<<<<< HEAD
import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// Fallback toast
const fallbackToast = (config: any) => {
  console[config.variant === 'destructive' ? 'error' : 'log'](config.title);
};

const ADMIN_EMAILS = [
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com',
  'berriescherry8@gmail.com'
] as const;

const supabaseUrl = 'https://lqymwrhfirszrakuevqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AdminAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
  incrementLoginAttempt: () => boolean;
}

export const useAdminAuth = create<AdminAuthState>((set, get) => ({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  user: null,

  incrementLoginAttempt: () => {
    const attempts = parseInt(localStorage.getItem('adminLoginAttempts') || '0');
    if (attempts >= 5) return false;
    localStorage.setItem('adminLoginAttempts', (attempts + 1).toString());
    setTimeout(() => {
      const current = parseInt(localStorage.getItem('adminLoginAttempts') || '0');
      if (current > 0) localStorage.setItem('adminLoginAttempts', (current - 1).toString());
    }, 60000);
    return true;
  },

  login: async (email: string, password: string) => {
    if (!get().incrementLoginAttempt()) {
      fallbackToast({ variant: 'destructive', title: 'Too many attempts. Wait 1 min.' });
      return false;
    }
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const isAdmin = ADMIN_EMAILS.includes(email as any);
      if (!isAdmin) throw new Error('Access denied - admin only');
      set({ isAuthenticated: true, isAdmin, user: data.user, isLoading: false });
      localStorage.removeItem('adminLoginAttempts');
      fallbackToast({ title: 'Login success!' });
      return true;
    } catch (error: any) {
      fallbackToast({ variant: 'destructive', title: error.message });
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    localStorage.removeItem('adminLoginAttempts');
    set({ isAuthenticated: false, isAdmin: false, user: null, isLoading: false });
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        const isAdmin = ADMIN_EMAILS.includes(user!.email! as any);
        set({ isAuthenticated: !!user, isAdmin, user, isLoading: false });
      } else {
        set({ isAuthenticated: false, isAdmin: false, user: null, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isAdmin: false, user: null, isLoading: false });
    }
  },

  refreshSession: async () => {
    await supabase.auth.refreshSession();
    await get().checkSession();
  }
}));

supabase.auth.onAuthStateChange((_, session) => {
  useAdminAuth.getState().checkSession();
});
=======
import { createSupabaseServerClient as createServerClient } from './supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type User } from '@supabase/supabase-js'

export interface AdminUser extends User {
  role: 'admin'
}

export async function getAdminUser(): Promise<AdminUser | null> {
  // Skip auth during static build/export to avoid cookies() call
  if (typeof window === 'undefined' && process.env.NEXT_PHASE?.includes('build')) {
    return null
  }
  
  const supabase = await createServerClient()
  
  if (!supabase) {
    return null
  }
  
  // Get session user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get profile role from DB
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Admin auth profile error:', profileError);
    return null;
  }

  if (!profile?.role || profile.role !== 'admin') {
    console.error('Admin auth failed: user', user.id, 'role:', profile?.role);
    return null
  }

  return { ...user, role: 'admin' } as AdminUser
}

export async function requireAdmin() {
  const admin = await getAdminUser()
  if (!admin) {
    redirect('/admin/login?error=unauthorized')
  }
  return admin
}

export async function isAdminUser(): Promise<boolean> {
  const admin = await getAdminUser()
  return !!admin
}

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
