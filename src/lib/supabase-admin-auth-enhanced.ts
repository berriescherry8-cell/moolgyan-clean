import { create } from 'zustand';
import { supabase, supabaseAdmin } from './supabase';

// Fallback toast function
const toast = (config: { variant?: string; title: string }) => {
  console.log(`[${config.variant || 'default'}] ${config.title}`);
};

const ADMIN_EMAILS = [
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com',
  'berriescherry8@gmail.com'
] as const;

interface SupabaseAdminAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: any | null;
  adminClient: typeof supabaseAdmin;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  initializeRealtime: () => void;
}

export const useSupabaseAdminAuth = create<SupabaseAdminAuthState>((set, get) => ({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  user: null,
  adminClient: supabaseAdmin,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const isAdmin = ADMIN_EMAILS.includes(email as any);
      set({ 
        isAuthenticated: true, 
        isAdmin,
        user: data.user, 
        isLoading: false 
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({ variant: "destructive", title: "Login failed" });
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ isAuthenticated: false, isAdmin: false, user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  sendPasswordReset: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset error:', error);
      return false;
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = ADMIN_EMAILS.includes(session?.user?.email as any);
      set({ 
        isAuthenticated: !!session,
        isAdmin,
        user: session?.user || null, 
        isLoading: false 
      });
    } catch (error) {
      set({ isAuthenticated: false, isAdmin: false, user: null, isLoading: false });
    }
  },

  initializeRealtime: () => {
    supabase.auth.onAuthStateChange((event, session) => {
      const isAdmin = ADMIN_EMAILS.includes(session?.user?.email as any);
      set({ 
        isAuthenticated: !!session,
        isAdmin,
        user: session?.user || null,
        isLoading: false
      });
    });
  },
}));

// Helper for layout
export const getAdminAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
