'use client';

import { create } from 'zustand';
import { createClient } from './supabase';

interface AdminAuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    if (typeof window === 'undefined') return;

    set({ isLoading: true });

    try {
      const supabase = createClient();
      if (!supabase) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      // Check profile role from database (secure, not hardcoded)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      set({
        isAuthenticated: true,
        user: { email: user.email, id: user.id },
        isLoading: false,
      });
    } catch (err) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Invalid environment' };
    }

    set({ isLoading: true, error: null });

    try {
      const supabase = createClient();
      if (!supabase) {
        set({ isLoading: false, error: 'Supabase client not available' });
        return { success: false, error: 'Supabase client not available' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Verify admin role from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        set({ isLoading: false, error: 'Access denied. Admin privileges required.' });
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      set({
        isAuthenticated: true,
        user: { email: data.user.email, id: data.user.id },
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: 'An error occurred. Please try again.' });
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  },

  signOut: async () => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      // Ignore errors during sign out
    }

    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));

// Listen for auth changes
if (typeof window !== 'undefined') {
  const supabase = createClient();
  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      useAdminAuthStore.getState().checkAuth();
    });
  }

  // Initial check
  useAdminAuthStore.getState().checkAuth();
}

// Export a hook for easier usage
export const useAdminAuth = () => {
  const store = useAdminAuthStore();

  return {
    ...store,
    checkSession: store.checkAuth,
    logout: store.signOut,
  };
};

