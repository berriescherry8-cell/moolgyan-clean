"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Camera, Video, BookOpen, Newspaper, ShoppingCart, Image, Music, MessageSquareQuote, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const adminModules = [
  { title: 'Books', icon: BookOpen, href: '/admin/books', color: 'bg-purple-500/20 text-purple-300', desc: 'Manage bookstore' },
  { title: 'Live Satsang', icon: Video, href: '/admin/live-satsang', color: 'bg-green-500/20 text-green-300', desc: 'Manage live streams' },
  { title: 'Playlists', icon: Music, href: '/admin/satsang-playlist', color: 'bg-pink-500/20 text-pink-300', desc: 'Satsang playlists' },
  { title: 'Wisdom Quotes', icon: MessageSquareQuote, href: '/admin/wisdom-quotes', color: 'bg-amber-500/20 text-amber-300', desc: 'Spiritual quotes' },
  { title: 'News', icon: Newspaper, href: '/admin/news', color: 'bg-orange-500/20 text-orange-300', desc: 'Manage news' },
  { title: 'Google Forms', icon: ExternalLink, href: '/admin/google-forms', color: 'bg-emerald-500/20 text-emerald-300', desc: 'Form links' },
  { title: 'Worksheets', icon: FileText, href: '/admin/worksheets', color: 'bg-yellow-500/20 text-yellow-300', desc: 'Admin worksheets' },
  { title: 'Satguru Bhajan', icon: Music, href: '/admin/satguru-bhajan', color: 'bg-rose-500/20 text-rose-300', desc: 'Bhajan management' },
  { title: 'Photos', icon: Camera, href: '/admin/photos', color: 'bg-blue-500/20 text-blue-300', desc: 'Photo gallery' },
  { title: 'Orders', icon: ShoppingCart, href: '/admin/orders', color: 'bg-indigo-500/20 text-indigo-300', desc: 'Book orders' },
  { title: 'Members', icon: Users, href: '/admin/members', color: 'bg-cyan-500/20 text-cyan-300', desc: 'User management' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-slate-400">Select a module to manage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminModules.map((module) => (
            <Link key={module.title} href={module.href}>
              <Card className="hover:shadow-xl transition-all border-0 bg-slate-800/50 backdrop-blur cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${module.color}`}>
                      <module.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 font-medium">{module.title}</p>
                      <p className="text-xs text-slate-500">{module.desc}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

