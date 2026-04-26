"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/lib/adminAuthStore';
import { 
  Newspaper, Video, Camera, BookOpen, ShoppingCart, 
  Music, MessageSquareQuote, FileText, ExternalLink, LogOut, Users 
} from "lucide-react";

const adminNavItems = [
  { href: "/admin/books", label: "Manage Bookstore", icon: BookOpen },
  { href: "/admin/live-satsang", label: "Live Satsang", icon: Video },
  { href: "/admin/satsang-playlist", label: "Playlists", icon: Music },
  { href: "/admin/wisdom-quotes", label: "Wisdom Quotes", icon: MessageSquareQuote },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/google-forms", label: "Google Forms", icon: ExternalLink },
  { href: "/admin/worksheets", label: "Worksheets", icon: FileText },
  { href: "/admin/satguru-bhajan", label: "Satguru Bhajan", icon: Music },
  { href: "/admin/photos", label: "Photos", icon: Camera },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/members", label: "Members", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAdminAuthStore();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 p-4 flex flex-col">
      <div className="mb-8">
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
