'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import AdminGuard from '@/components/AdminGuard';

interface Profile {
  email: string;
  role: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          email: session.user.email!,
          role: 'admin' // Confirmed by guard
        });

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData || null);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    } else {
      router.push('/login');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            {user && (
              <div className="glass-card p-6 rounded-2xl max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-yellow-400 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{user.email}</p>
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">Admin Role</p>
                  </div>
                </div>
                {profile?.updated_at && (
                  <p className="text-xs text-white/50">Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card h-[200px] group hover:border-primary/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Books Management</CardTitle>
                <CardDescription>Manage books, orders, and inventory</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/admin/books" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Go to Books →
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card h-[200px] group hover:border-primary/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
<div className="w-6 h-6 text-white bg-green-500 rounded-full flex items-center justify-center">
  <Image className="w-4 h-4 text-white" />
</div>
                </div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription>Send push notifications to users</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/admin/notifications" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Go to Notifications →
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card h-[200px]">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
                <CardTitle className="text-xl">More Coming Soon</CardTitle>
                <CardDescription>News, Videos, Orders & more</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 text-sm">
                <div>📢 News Management</div>
                <div>🎥 Video Library</div>
                <div>📋 Orders Dashboard</div>
              </CardContent>
            </Card>
          </div>

          {/* Logout */}
          <div className="text-center pt-12">
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="glass-card px-8 py-6 text-lg font-semibold hover:bg-white/10 border-white/20 group"
            >
              <LogOut className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-all duration-300" />
              Logout Securely
            </Button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
