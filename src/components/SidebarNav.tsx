"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { getNavItems } from '@/lib/nav-items';
import type { NavItem } from '@/lib/nav-items';
import { useLocale } from '@/lib/i18n';
import { Separator } from './ui/separator';
<<<<<<< HEAD
import { useAdminAuth } from '@/lib/adminAuth';
=======
import { useAdminAuthStore } from '@/lib/adminAuthStore';
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const navItems = getNavItems(t);
<<<<<<< HEAD
  const { isAuthenticated } = useAdminAuth();

  const regularItems = navItems.filter(item => !item.isAdmin && !item.isHidden);
  const adminItems = navItems.filter(item => item.isAdmin);
=======
  const { isAuthenticated } = useAdminAuthStore();

  // Don't show admin items in the main app sidebar - they have their own admin sidebar
  const regularItems = navItems.filter(item => !item.isAdmin && !item.isHidden);
  const adminItems = []; // Empty - admin pages use AdminSidebar instead
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

  return (
    <nav className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png"
            alt="Mool Gyan Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
<<<<<<< HEAD
          <span className="font-headline group-data-[collapsible=icon]:hidden">{t('app_name')}</span>
=======
          <span className="font-headline hidden sm:inline">{t('app_name')}</span>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-1 px-2 text-sm font-medium lg:px-4">
          {regularItems.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50',
                pathname === item.href && 'bg-muted text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
<<<<<<< HEAD
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
=======
              <span>{item.label}</span>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
            </Link>
          ))}
        </div>

        {/* Admin Section - only show if logged in */}
        {isAuthenticated && adminItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-4 lg:px-6 space-y-2">
<<<<<<< HEAD
              <p className="px-2 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
=======
              <p className="px-2 text-xs font-semibold text-muted-foreground hidden sm:block">
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
                ADMIN SECTION
              </p>
              <div className="flex flex-col gap-1 text-sm font-medium">
                {adminItems.map((item: NavItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50',
                      pathname.startsWith(item.href) && 'bg-muted text-primary'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
<<<<<<< HEAD
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
=======
                    <span>{item.label}</span>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
