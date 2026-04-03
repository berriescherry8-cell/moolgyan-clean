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
import { useAdminAuth } from '@/lib/adminAuth';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const navItems = getNavItems(t);
  const { isAuthenticated } = useAdminAuth();

  const regularItems = navItems.filter(item => !item.isAdmin && !item.isHidden);
  const adminItems = navItems.filter(item => item.isAdmin);

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
          <span className="font-headline group-data-[collapsible=icon]:hidden">{t('app_name')}</span>
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
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Admin Section - only show if logged in */}
        {isAuthenticated && adminItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-4 lg:px-6 space-y-2">
              <p className="px-2 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
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
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
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
