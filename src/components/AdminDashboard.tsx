<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Book, 
  Image as ImageIcon, 
  Video, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Shield, 
  Globe, 
  Database, 
  Wifi, 
  Zap, 
  Eye, 
<<<<<<< HEAD
  EyeOff 
} from 'lucide-react';
import { useSupabaseAdminAuth } from '@/lib/supabase-admin-auth';

=======
  EyeOff,
  Activity,
  TrendingUp,
  Clock,
  Bell,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Youtube
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

const adminSections = [
  {
    title: 'Content Management',
    description: 'Manage books, photos, videos, and other content',
    icon: Book,
    color: 'from-blue-600 to-blue-800',
    items: [
      { name: 'Books', href: '/admin/books', icon: Book },
      { name: 'Photos', href: '/admin/photos', icon: ImageIcon },
      { name: 'Videos', href: '/admin/videos', icon: Video },
      { name: 'News', href: '/admin/news', icon: Globe },
      { name: 'Wisdom Quotes', href: '/admin/wisdom-quotes', icon: MessageCircle },
    ]
  },
  {
    title: 'User Management',
    description: 'Manage users, orders, and feedback',
    icon: Users,
    color: 'from-green-600 to-green-800',
    items: [
      { name: 'Members', href: '/admin/members', icon: Users },
      { name: 'Orders', href: '/admin/orders', icon: Database },
      { name: 'Feedback', href: '/admin/feedback', icon: MessageCircle },
      { name: 'Deeksha Aavedan', href: '/admin/deeksha', icon: Shield },
    ]
  },
  {
    title: 'System Tools',
    description: 'System settings and maintenance tools',
    icon: Settings,
    color: 'from-purple-600 to-purple-800',
    items: [
      { name: 'Storage Browser', href: '/admin/tools/storage-browser', icon: Database },
      { name: 'Google Forms', href: '/admin/google-forms', icon: Globe },
      { name: 'Worksheet', href: '/admin/worksheet', icon: Settings },
      { name: 'Live Satsang', href: '/admin/live-satsang', icon: Wifi },
<<<<<<< HEAD
=======
      { name: 'YouTube Automation', href: '/admin/youtube-automation', icon: Youtube },
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
    ]
  }
];

<<<<<<< HEAD
export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const { logout } = useSupabaseAdminAuth();


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
=======
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalBooks: number;
  totalPhotos: number;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: any;
  }>;
  systemStatus: {
    database: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
    auth: 'healthy' | 'warning' | 'error';
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalBooks: 0,
    totalPhotos: 0,
    recentActivity: [],
    systemStatus: {
      database: 'healthy',
      storage: 'healthy',
      auth: 'healthy'
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: string;
  }>>([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const supabase = createClient();
      if (!supabase) return;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }

      // Load stats in parallel
      const [
        usersCount,
        ordersCount,
        booksCount,
        photosCount,
        recentActivity
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('photos').select('id', { count: 'exact' }),
        supabase
          .from('admin_activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      setStats(prev => ({
        ...prev,
        totalUsers: usersCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalBooks: booksCount.count || 0,
        totalPhotos: photosCount.count || 0,
        recentActivity: recentActivity.data || []
      }));

      // Check system health
      const systemHealth = await checkSystemHealth(supabase);
      setStats(prev => ({
        ...prev,
        systemStatus: systemHealth
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check system health
  const checkSystemHealth = async (supabase: any) => {
    const health = {
      database: 'healthy' as const,
      storage: 'healthy' as const,
      auth: 'healthy' as const
    };

    try {
      // Test database connection
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) health.database = 'error';

      // Test storage (if available)
      // This would require actual storage implementation
      // For now, assume healthy

      // Test auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) health.auth = 'warning';

    } catch (error) {
      health.database = 'error';
      health.auth = 'error';
    }

    return health;
  };

  // Refresh dashboard data
  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Handle logout with enhanced security
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      if (supabase) {
        // Log logout activity
        if (currentUser) {
          await supabase
            .from('admin_activity_log')
            .insert({
              user_id: currentUser.id,
              action: 'LOGOUT',
              details: { email: currentUser.email, timestamp: new Date().toISOString() }
            });
        }

        // Clear Supabase session
        await supabase.auth.signOut();
      }
      
      // Clear all admin data from localStorage
      localStorage.removeItem('moolgyan_admin');
      localStorage.removeItem('moolgyan_admin_session');
      
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      localStorage.removeItem('moolgyan_admin');
      localStorage.removeItem('moolgyan_admin_session');
      router.push('/admin/login');
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
    } finally {
      setIsLoggingOut(false);
    }
  };

<<<<<<< HEAD
  const handleSectionClick = (href: string) => {
    router.push(href);
  };

=======
  // Handle section click with activity logging
  const handleSectionClick = async (href: string, sectionName: string) => {
    try {
      const supabase = createClient();
      if (supabase && currentUser) {
        // Log navigation activity
        await supabase
          .from('admin_activity_log')
          .insert({
            user_id: currentUser.id,
            action: 'NAVIGATION',
            details: { 
              destination: href, 
              section: sectionName,
              timestamp: new Date().toISOString()
            }
          });
      }
    } catch (error) {
      console.error('Error logging navigation:', error);
    }
    
    router.push(href);
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    loadDashboardData();
    
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Real-time subscription for activity updates
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const subscription = supabase
      .channel('admin_activity')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'admin_activity_log' 
        },
        (payload) => {
          // Update recent activity in real-time
          setStats(prev => ({
            ...prev,
            recentActivity: [payload.new as any, ...prev.recentActivity.slice(0, 9)]
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Mool Gyan App Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Secure Admin Area</span>
              </div>
<<<<<<< HEAD
=======
              
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={refreshing}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
<<<<<<< HEAD
                <div>
=======
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
                {isLoggingOut ? (
                  <><LogOut className="w-4 h-4 mr-2 animate-spin" /> Logging out...</>
                ) : (
                  <><LogOut className="w-4 h-4 mr-2" /> Logout</>
                )}
<<<<<<< HEAD
                </div>
              </Button>

=======
              </Button>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Admin Panel</h2>
          <p className="text-gray-400">Manage your app content, users, and system settings from here.</p>
<<<<<<< HEAD
        </div>

        {/* Quick Actions */}
=======
          {currentUser && (
            <p className="text-gray-500 text-sm mt-2">
              Logged in as: {currentUser.email} | Session active
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <Database className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                </div>
                <Book className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Photos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={`bg-gradient-to-r ${section.color} text-white rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="text-white text-opacity-80 text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Button
                          key={item.name}
                          variant="outline"
<<<<<<< HEAD
                          onClick={() => handleSectionClick(item.href)}
=======
                          onClick={() => handleSectionClick(item.href, item.name)}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
                          className="justify-start font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <ItemIcon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

<<<<<<< HEAD
=======
        {/* System Status and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Status */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-green-600" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Database</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(stats.systemStatus.database)}`}>
                  {getStatusIcon(stats.systemStatus.database)}
                  <span className="capitalize">{stats.systemStatus.database}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Storage</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(stats.systemStatus.storage)}`}>
                  {getStatusIcon(stats.systemStatus.storage)}
                  <span className="capitalize">{stats.systemStatus.storage}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Authentication</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(stats.systemStatus.auth)}`}>
                  {getStatusIcon(stats.systemStatus.auth)}
                  <span className="capitalize">{stats.systemStatus.auth}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        {/* Security Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span>Security Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Secure Access</p>
                <p className="text-sm text-green-700">This admin area is password protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Session Management</p>
                <p className="text-sm text-blue-700">Auto-logout after 24 hours of inactivity</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <EyeOff className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">Hidden Access</p>
                <p className="text-sm text-purple-700">Admin login is not visible to regular users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>For security, always log out when finished. Contact support if you need assistance.</p>
<<<<<<< HEAD
=======
          <p className="mt-2">Last refresh: {new Date().toLocaleString()}</p>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        </div>
      </main>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
