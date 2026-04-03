'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SidebarNav from '@/components/SidebarNav';
import { useAdminAuth } from '@/lib/adminAuth';
import { Button } from '@/components/ui/button';
import { User, LogOut, Zap, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { checkSession, isAuthenticated, logout, isLoading, user } = useAdminAuth();
  const [notifications, setNotifications] = useState(0); // realtime

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Loading - middleware already checked server-side
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-white mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Portal Loading</h2>
              <p className="text-slate-300">Quantum sync in progress...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Access Denied (Middleware should block)</div>; // fallback
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-900/50 to-slate-950 text-white overflow-hidden">
      {/* Enhanced Sidebar */}
      <SidebarNav />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar with profile */}
        <div className="h-16 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center px-6 shadow-lg">
          <div className="flex-1" />
          <Badge variant="secondary" className="mr-4 bg-gradient-to-r from-green-500 to-emerald-600">
            <Zap className="h-3 w-3 mr-1" />
            Online
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 hover:bg-white/10">
                <User className="h-5 w-5" />
                <span>{user?.email?.split('@')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-white/20 w-56 mr-4">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-white/10">
                <LogOut className="h-4 w-4 mr-2" />
                Secure Logout
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

