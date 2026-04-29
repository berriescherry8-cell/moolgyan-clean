'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image as ImageIcon, 
  ShoppingCart, 
  FileText, 
  Music, 
  Quote,
  Video,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Home,
  Package,
  FileText as FileIcon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdminAuth } from '@/lib/adminAuthStore';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  {
    title: 'Photos',
    href: '/admin/photos',
    icon: ImageIcon,
    description: 'Photo galleries management',
    badge: 'New'
  },
  {
    title: 'Books',
    href: '/admin/books',
    icon: BookOpen,
    description: 'Book inventory and sales'
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Customer orders management'
  },
  {
    title: 'News',
    href: '/admin/news',
    icon: FileText,
    description: 'News articles management'
  },
  {
    title: 'Satguru Bhajan',
    href: '/admin/satguru-bhajan',
    icon: Music,
    description: 'Bhajans and video content'
  },
  {
    title: 'Wisdom Quotes',
    href: '/admin/wisdom-quotes',
    icon: Quote,
    description: 'Inspirational quotes'
  },
  {
    title: 'Live Satsang',
    href: '/admin/live-satsang',
    icon: Video,
    description: 'Live streaming management'
  },
  {
    title: 'Google Forms',
    href: '/admin/google-forms',
    icon: FileIcon,
    description: 'Form links management'
  }
];

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="ml-3 text-white font-semibold">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-white hover:bg-slate-800"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <a
            href="/admin/dashboard"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </a>
        </div>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* User Section */}
        <div className="border-t border-slate-800 pt-4 mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
                <User className="h-5 w-5 mr-3" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || 'Admin'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user?.email || 'admin@moolgyan.com'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="text-xs text-slate-400">
          <div className="flex items-center mb-2">
            <Package className="h-3 w-3 mr-1" />
            <span>Mool Gyan Admin v2.0</span>
          </div>
          <div>© 2026 All rights reserved</div>
        </div>
      </div>
    </div>
  );
}

function AdminTopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-slate-600 hover:bg-slate-100"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb/Title */}
        <div className="flex-1 flex items-center">
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-slate-900">Mool Gyan Administration</h1>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 hover:bg-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { checkSession, isAuthenticated, isLoading, user } = useAdminAuth();

  useEffect(() => {
    if (pathname !== '/admin/login' && pathname !== '/admin/login/') {
      checkSession();
    }
  }, [pathname]);

  // For login page, just render children without any auth logic
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 shadow-xl">
            <div className="w-16 h-16 border-4 border-white border-t-transparent animate-spin rounded-full"></div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white mb-2">Loading Admin Panel</h2>
              <p className="text-blue-100">Initializing secure session...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback access denied
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">Please authenticate to access the admin panel</p>
          <a
            href="/admin/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Main authenticated layout
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <AdminTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
