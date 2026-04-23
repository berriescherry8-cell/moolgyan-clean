"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Camera, Video, BookOpen, Newspaper, ShoppingCart } from 'lucide-react';
import { useSupabaseClient } from '@/hooks/useSupabase';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Stats {
  totalPhotos: number;
  totalSatsangs: number;
  totalBooks: number;
  totalNews: number;
  totalOrders: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const supabase = useSupabaseClient();
  const [stats, setStats] = useState<Stats>({
    totalPhotos: 0,
    totalSatsangs: 0,
    totalBooks: 0,
    totalNews: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!supabase) {
      setError('Supabase client not available. Check .env.local env vars.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [
        { count: photos },
        { count: satsangs },
        { count: books },
        { count: news },
        { count: orders },
        { count: users }
      ] = await Promise.all([
        supabase.from('photos').select('*', { count: 'exact', head: true }),
        supabase.from('live_satsangs').select('*', { count: 'exact', head: true }),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalPhotos: photos || 0,
        totalSatsangs: satsangs || 0,
        totalBooks: books || 0,
        totalNews: news || 0,
        totalOrders: orders || 0,
        totalUsers: users || 0,
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError('Database query failed. Run SQL fixes (see TODO.md). Tables/RLS may be missing.');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Photos', value: stats.totalPhotos, icon: Camera, href: '/admin/photos', color: 'bg-blue-500/20' },
    { title: 'Live Satsangs', value: stats.totalSatsangs, icon: Video, href: '/admin/live-satsang', color: 'bg-green-500/20' },
    { title: 'Books', value: stats.totalBooks, icon: BookOpen, href: '/admin/books', color: 'bg-purple-500/20' },
    { title: 'News Items', value: stats.totalNews, icon: Newspaper, href: '/admin/news', color: 'bg-orange-500/20' },
    { title: 'Orders', value: stats.totalOrders, icon: ShoppingCart, href: '/admin/orders', color: 'bg-indigo-500/20' },
    { title: 'Users', value: stats.totalUsers, icon: Users, href: '/admin/members', color: 'bg-pink-500/20' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-slate-400">Manage your content and users</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                ⚠️ Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">{error}</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-yellow-200 text-sm">
                See TODO.md for SQL files to run in your Supabase dashboard SQL editor.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsCards.map((stat) => (
                  <div key={stat.title} className="p-6 rounded-xl border-2 border-slate-700/50 bg-slate-800/50 text-center hover:border-indigo-500/50 transition-colors">
                    <stat.icon className="h-10 w-10 mx-auto mb-3 opacity-60" />
                    <p className="text-sm uppercase font-medium text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-400">—</p>
                    <a href={stat.href} className="mt-2 block text-indigo-400 hover:text-indigo-300 font-medium text-xs">
                      → Manage
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsCards.map((stat) => (
                <Card key={stat.title} className="hover:shadow-xl transition-all border-0 bg-slate-800/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 uppercase font-medium tracking-wide">{stat.title}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href={stat.href} className="text-indigo-400 hover:text-indigo-300 font-medium text-sm inline-flex items-center gap-1">
                      Manage →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-blue-500/20">Photos</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-500/20">Live Satsang</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-purple-500/20">Books</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-orange-500/20">News</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-indigo-500/20">Orders</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-pink-500/20">Users</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-emerald-500/20">Google Forms</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-yellow-500/20">Worksheets</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
