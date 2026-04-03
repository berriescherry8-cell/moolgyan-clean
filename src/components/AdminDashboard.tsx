import { useState } from 'react';
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
  EyeOff 
} from 'lucide-react';
import { useSupabaseAdminAuth } from '@/lib/supabase-admin-auth';


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
    ]
  }
];

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
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSectionClick = (href: string) => {
    router.push(href);
  };

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
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                <div>
                {isLoggingOut ? (
                  <><LogOut className="w-4 h-4 mr-2 animate-spin" /> Logging out...</>
                ) : (
                  <><LogOut className="w-4 h-4 mr-2" /> Logout</>
                )}
                </div>
              </Button>

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
        </div>

        {/* Quick Actions */}
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
                          onClick={() => handleSectionClick(item.href)}
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
        </div>
      </main>
    </div>
  );
}