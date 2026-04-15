"use client";

import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Newspaper, 
  Video, 
  Camera, 
  BookOpen, 
  UserPlus, 
  HelpCircle, 
  ShoppingCart, 
  Music, 
  MessageSquareQuote, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  LogOut, 
  Bell, 
  Users, 
  Settings, 
  Database, 
  Library 
} from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Manage Bookstore", icon: BookOpen },
  { href: "/admin/live-satsang", label: "Manage Live Satsang", icon: Video },
  { href: "/admin/satsang-playlist", label: "Manage Satsang Playlists", icon: Music },
  { href: "/admin/wisdom-quotes", label: "Wisdom Quotes", icon: MessageSquareQuote },
  { href: "/admin/news", label: "Manage News", icon: Newspaper },
  { href: "/admin/google-forms", label: "Google Forms", icon: ExternalLink },
  { href: "/admin/worksheets", label: "Admin Worksheets", icon: FileText },
  { href: "/admin/satguru-bhajan", label: "Satguru Bhajan", icon: Music },
  { href: "/admin/photos", label: "Photos Manage", icon: Camera },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const supabase = useSupabaseClient();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        setAdminName(profile?.full_name || session.user.email || 'Admin');
      }
    };
    fetchAdminData();
  }, [supabase]);

  return (
    <div className="w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 p-4 flex flex-col">
      <div className="mb-8">
        <p className="text-indigo-300 font-medium mb-1">Welcome, {adminName}</p>
        <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
        <p className="text-slate-400 text-sm">Secure Management</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/50"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <form action="/admin/logout/action">
          <button type="submit" className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}