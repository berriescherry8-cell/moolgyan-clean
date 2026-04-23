'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

const ADMIN_EMAILS = [
  'sharmadevendra715@gmail.com',
  'kpdeora1986@gmail.com',
  'berriescherry8@gmail.com'
];

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const checkAdminStatus = async () => {
    try {
      setIsChecking(true);
      setError('');

      // First check localStorage for quick access
      const adminEmail = localStorage.getItem('moolgyan_admin');
      const sessionTime = localStorage.getItem('moolgyan_admin_session');
      
      // Check if session is expired (24 hours)
      if (sessionTime) {
        const sessionAge = Date.now() - parseInt(sessionTime);
        if (sessionAge > 24 * 60 * 60 * 1000) {
          // Session expired, clear and redirect
          localStorage.removeItem('moolgyan_admin');
          localStorage.removeItem('moolgyan_admin_session');
          router.push('/admin/login');
          return;
        }
      }

      // Create Supabase client
      const supabase = createClient();
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Session verification failed');
      }

      if (!session || !session.user) {
        // No valid session, redirect to login
        router.push('/admin/login');
        return;
      }

      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active, locked_until, email')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Profile not found, sign out and redirect
        await supabase.auth.signOut();
        localStorage.removeItem('moolgyan_admin');
        localStorage.removeItem('moolgyan_admin_session');
        router.push('/admin/login');
        return;
      }

      // Check account status
      if (!profile.is_active) {
        setError('Account is deactivated');
        setTimeout(() => {
          supabase.auth.signOut();
          localStorage.removeItem('moolgyan_admin');
          localStorage.removeItem('moolgyan_admin_session');
          router.push('/admin/login');
        }, 2000);
        return;
      }

      if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
        setError('Account is temporarily locked');
        setTimeout(() => {
          supabase.auth.signOut();
          localStorage.removeItem('moolgyan_admin');
          localStorage.removeItem('moolgyan_admin_session');
          router.push('/admin/login');
        }, 2000);
        return;
      }

      if (profile.role !== 'admin') {
        // Not an admin, sign out and redirect
        await supabase.auth.signOut();
        localStorage.removeItem('moolgyan_admin');
        localStorage.removeItem('moolgyan_admin_session');
        router.push('/admin/login');
        return;
      }

      // Verify email matches allowed admin emails
      if (!ADMIN_EMAILS.includes(profile.email)) {
        // Email not in allowed list, sign out and redirect
        await supabase.auth.signOut();
        localStorage.removeItem('moolgyan_admin');
        localStorage.removeItem('moolgyan_admin_session');
        router.push('/admin/login');
        return;
      }

      // Update localStorage with current admin email
      localStorage.setItem('moolgyan_admin', profile.email);
      
      // Update session time
      localStorage.setItem('moolgyan_admin_session', Date.now().toString());

      setIsAdmin(true);

    } catch (error: any) {
      console.error('Admin check error:', error);
      setError(error.message || 'Authentication check failed');
      
      // Clear any existing admin data
      localStorage.removeItem('moolgyan_admin');
      localStorage.removeItem('moolgyan_admin_session');
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [router]);

  // Set up real-time session monitoring
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          // User signed out, redirect to login
          localStorage.removeItem('moolgyan_admin');
          localStorage.removeItem('moolgyan_admin_session');
          router.push('/admin/login');
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refreshed, update session time
          localStorage.setItem('moolgyan_admin_session', Date.now().toString());
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  // Auto-check session every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkAdminStatus();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Verifying admin access...</p>
          <p className="text-gray-400 text-sm mt-2">Securing your session</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
