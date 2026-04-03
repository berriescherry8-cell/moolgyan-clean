'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Header from '@/components/Header';
import SidebarNav from '@/components/SidebarNav';
import SplashScreen from './SplashScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNavBar from './BottomNavBar';
import Link from 'next/link';
import AppOnboarding from './AppOnboarding';

function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const AppFooter = () => (
    <footer className="p-4 text-center text-xs text-muted-foreground">
      <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
      <p>© {new Date().getFullYear()} Mool Gyan. All Rights Reserved.</p>
    </footer>
  );

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-black">
        <Sidebar>
          <SidebarRail />
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <SidebarInset className="bg-black">
            <main className={isMobile ? "flex-1 p-4 pb-20 animate-fade-in-up" : "flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up max-w-7xl mx-auto w-full"}>
              {children}
            </main>
            <AppFooter />
          </SidebarInset>
          {isMobile && <BottomNavBar />}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000); // Reduced from 2000ms to 1000ms
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isAppLoading || !isClient) {
    return <SplashScreen />;
  }

  return <ClientOnlyLayout>{children}</ClientOnlyLayout>;
}
