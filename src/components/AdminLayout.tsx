"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSupabaseAdminAuth as useAdminAuth } from '@/lib/admin-auth';
import SidebarNav from '@/components/SidebarNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAdminAuth();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Agar login page hai toh sirf children dikhao (sidebar mat dikhao)
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return <>{children}</>;
  }

  // Agar authenticated nahi hai aur koi aur admin page hai toh login par bhejo
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-8">Please login first</p>
          <a 
            href="/admin/login" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Normal admin pages (with sidebar)
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
