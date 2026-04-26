'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image, 
  ShoppingCart, 
  FileText, 
  Music, 
  Quote,
  Video,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Eye,
  Plus,
  Settings,
  BarChart3
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
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('7d');

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
        todayOrdersData,
        weekOrdersData,
        monthOrdersData
      ] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('photos').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('news_items').select('id', { count: 'exact' }),
        supabase.from('satguru_bhajan').select('id', { count: 'exact' }),
        supabase.from('wisdom_quotes').select('id', { count: 'exact' }),
        supabase.from('live_satsangs').select('id', { count: 'exact' }),
        // Time-based order counts
        supabase.from('orders').select('*', { count: 'exact' }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from('orders').select('*', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('orders').select('*', { count: 'exact' }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Fetch recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const totalRevenue = recentOrdersData?.reduce((sum, order) => 
        sum + (order.total_price || 0), 0) || 0;

      setStats({
        totalBooks: booksCount.count || 0,
        totalPhotos: photosCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalNews: newsCount.count || 0,
        totalBhajans: bhajansCount.count || 0,
        totalQuotes: quotesCount.count || 0,
        totalLiveSatsangs: liveSatsangsCount.count || 0,
        recentOrders: recentOrdersData || [],
        pendingOrders: 0, // You can add this logic later if needed
        totalRevenue,
        todayOrders: todayOrdersData.count || 0,
        weekOrders: weekOrdersData.count || 0,
        monthOrders: monthOrdersData.count || 0
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

  const quickActions: QuickAction[] = [
    {
      title: 'Add Photo',
      description: 'Upload new images to gallery',
      icon: <Image className="h-5 w-5" />,
      href: '/admin/photos',
      color: 'bg-blue-500',
      badge: 'New'
    },
    {
      title: 'Create News',
      description: 'Publish new article',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/news',
      color: 'bg-green-500'
    },
    {
      title: 'Add Book',
      description: 'Add new book to inventory',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/admin/books',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Orders',
      description: 'View and process orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      href: '/admin/orders',
      color: 'bg-orange-500'
    },
    {
      title: 'Add Bhajan',
      description: 'Upload new satguru bhajan',
      icon: <Music className="h-5 w-5" />,
      href: '/admin/satguru-bhajan',
      color: 'bg-pink-500'
    },
    {
      title: 'Live Satsang',
      description: 'Schedule live session',
      icon: <Video className="h-5 w-5" />,
      href: '/admin/live-satsang',
      color: 'bg-red-500'
    }
  ];

  const getPeriodStats = () => {
    if (!stats) return { orders: 0, percentage: 0 };
    
    let orders = 0;
    switch (selectedPeriod) {
      case '24h':
        orders = stats.todayOrders;
        break;
      case '7d':
        orders = stats.weekOrders;
        break;
      case '30d':
        orders = stats.monthOrders;
        break;
      default:
        orders = stats.totalOrders;
    }
    
    const percentage = stats.totalOrders > 0 ? (orders / stats.totalOrders) * 100 : 0;
    return { orders, percentage };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 shadow-xl">
            <div className="w-16 h-16 border-4 border-white border-t-transparent animate-spin rounded-full"></div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
              <p className="text-blue-100">Fetching real-time data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Real-time overview of your Mool Gyan application</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/admin/settings', '_self')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-4 ${action.color} transition-transform duration-300 group-hover:scale-110`}>
                <action.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-slate-100"
                onClick={() => window.location.href = action.href}
              >
                {action.badge && (
                  <Badge variant="secondary" className="mr-2">
                    {action.badge}
                  </Badge>
                )}
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Items */}
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Books</p>
                <p className="text-3xl font-bold">{stats?.totalBooks || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Photos</p>
                <p className="text-3xl font-bold">{stats?.totalPhotos || 0}</p>
              </div>
              <Image className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Orders</p>
                <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total News</p>
                <p className="text-3xl font-bold">{stats?.totalNews || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="md:col-span-2 lg:col-span-2 border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Revenue</p>
                <p className="text-4xl font-bold text-emerald-700">{formatCurrency(stats?.totalRevenue || 0)}</p>
              </div>
              <DollarSign className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <p className="text-2xl font-bold text-emerald-600">{stats?.todayOrders || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-emerald-600">{stats?.weekOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-pink-500" />
              Satguru Bhajans
            </CardTitle>
            <CardDescription>Spiritual content management</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-pink-600">{stats?.totalBhajans || 0}</p>
                <p className="text-sm text-muted-foreground">Total bhajans</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-indigo-500" />
              Wisdom Quotes
            </CardTitle>
            <CardDescription>Inspirational content</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-indigo-600">{stats?.totalQuotes || 0}</p>
                <p className="text-sm text-muted-foreground">Total quotes</p>
              </div>
              <Quote className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-500" />
              Live Satsangs
            </CardTitle>
            <CardDescription>Live streaming sessions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-600">{stats?.totalLiveSatsangs || 0}</p>
                <p className="text-sm text-muted-foreground">Total sessions</p>
              </div>
              <Video className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/admin/orders'}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All
            </Button>
          </CardTitle>
          <CardDescription>Latest customer orders and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.book_title} × {order.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(order.total_price || 0)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length > 5 && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin/orders'}
                  >
                    View All Orders
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recent orders</h3>
              <p className="text-gray-500 mb-4">Start selling books to see orders here</p>
              <Button onClick={() => window.location.href = '/admin/books'}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Order Analytics
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4">
              <span>Time Period:</span>
              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === '24h' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('24h')}
                >
                  24h
                </Button>
                <Button
                  variant={selectedPeriod === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('7d')}
                >
                  7d
                </Button>
                <Button
                  variant={selectedPeriod === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod('30d')}
                >
                  30d
                </Button>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orders in {selectedPeriod}</p>
                <p className="text-3xl font-bold">{getPeriodStats().orders}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">
                    +{getGrowthRate(getPeriodStats().orders, stats.totalOrders - getPeriodStats().orders).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <Progress value={getPeriodStats().percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
