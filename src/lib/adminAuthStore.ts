import { createClient } from './supabase';
import { create } from 'zustand';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  checkAuth: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    set({ 
      isAuthenticated: !!session,
      user: session?.user || null,
      isLoading: false 
    });
  },
  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ 
      isAuthenticated: false,
      user: null 
    });
  }
}));

// Initialize on mount - zustand persist disabled as 'use client' component

