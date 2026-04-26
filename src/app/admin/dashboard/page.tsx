'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Image, 
  ShoppingCart, 
  FileText, 
  Music, 
  Quote,
  Video,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/data-manager';

interface DashboardStats {
  totalBooks: number;
  totalPhotos: number;
  totalOrders: number;
  totalNews: number;
  totalBhajans: number;
  totalQuotes: number;
  totalLiveSatsangs: number;
  recentOrders: any[];
  pendingOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      // Fetch counts from all tables
      const [
        booksCount,
        photosCount,
        ordersCount,
        newsCount,
        bhajansCount,
        quotesCount,
        liveSatsangsCount,
        recentOrdersData,
        pendingOrdersData
      ] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('photos').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('news_items').select('id', { count: 'exact' }),
        supabase.from('satguru_bhajan').select('id', { count: 'exact' }),
        supabase.from('wisdom_quotes').select('id', { count: 'exact' }),
        supabase.from('live_satsangs').select('id', { count: 'exact' }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      const totalRevenue = recentOrdersData.data?.reduce((sum, order) => 
        sum + (order.total_price || 0), 0) || 0;

      setStats({
        totalBooks: booksCount.count || 0,
        totalPhotos: photosCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalNews: newsCount.count || 0,
        totalBhajans: bhajansCount.count || 0,
        totalQuotes: quotesCount.count || 0,
        totalLiveSatsangs: liveSatsangsCount.count || 0,
        recentOrders: recentOrdersData.data || [],
        pendingOrders: pendingOrdersData.count || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard statistics'
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/books'
    },
    {
      title: 'Photos',
      value: stats?.totalPhotos || 0,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/photos'
    },
    {
      title: 'Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/orders'
    },
    {
      title: 'News Articles',
      value: stats?.totalNews || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/news'
    },
    {
      title: 'Satguru Bhajans',
      value: stats?.totalBhajans || 0,
      icon: Music,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/admin/satguru-bhajan'
    },
    {
      title: 'Wisdom Quotes',
      value: stats?.totalQuotes || 0,
      icon: Quote,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/wisdom-quotes'
    },
    {
      title: 'Live Satsangs',
      value: stats?.totalLiveSatsangs || 0,
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/live-satsang'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/admin/orders?filter=pending'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Mool Gyan application</p>
        </div>
        <Button onClick={fetchDashboardStats} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <a href={card.href}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Total revenue from all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              From {stats?.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders?.length ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.book_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total_price}</p>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/photos">
                <Image className="h-4 w-4" />
                Upload Photos
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/books">
                <BookOpen className="h-4 w-4" />
                Add Book
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/news">
                <FileText className="h-4 w-4" />
                Post News
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/orders">
                <ShoppingCart className="h-4 w-4" />
                View Orders
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
