'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import type { NavItem } from '@/lib/nav-items';
import { useLocale } from '@/lib/i18n';
import { Separator } from './ui/separator';
import { useAdminAuthStore } from '@/lib/adminAuthStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNavItems } from '@/lib/nav-items';

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const navItems = getNavItems(t);
  const { isAuthenticated } = useAdminAuthStore();

  // Don't show admin items in the main app sidebar - they have their own admin sidebar
  const regularItems = navItems.filter(item => !item.isAdmin && !item.isHidden);
  const adminItems = []; // Empty - admin pages use AdminSidebar instead

  return (
    <nav className="flex h-full flex-col">
      {/* Logo */}
      <div className="mb-8 px-4 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300"
            height={40}
            width={40}
          />
          <span className="font-headline hidden sm:inline">{t('app_name')}</span>
        </Link>
      </div>

      <div className="flex-1 px-2">
        {/* Regular navigation */}
        {regularItems.map((item) => (
          <Collapsible key={item.href} className="pb-2">
            <CollapsibleTrigger asChild>
              <Link href={item.href} className={cn(
                'group flex w-full items-center rounded-md border border-transparent px-2.5 py-3 text-sm font-medium text-muted-foreground hover:underline hover:decoration-primary/50',
                pathname === item.href && 'border-primary bg-primary/10 text-primary'
              )}>
                <item.icon className="mr-3 h-5 w-5" aria-hidden />
                <span>{item.label}</span>
                <ChevronRight className={cn(
                  'ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90'
                )} />
              </Link>
            </CollapsibleTrigger>
            {item.items ? (
              <CollapsibleContent className="mt-1 space-y-1 pl-6">
                {item.items.map((child) => (
                  <Link 
                    key={child.href} 
                    href={child.href}
                    className={cn(
                      'flex w-full items-center rounded-md p-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      pathname === child.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </CollapsibleContent>
            ) : null}
          </Collapsible>
        ))}
      </div>

      <div className="mt-auto p-4">
        <Separator className="my-2" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</p>
          <p className="text-[0.7rem] leading-tight">
            {t('powered_by')}
          </p>
        </div>
      </div>
    </nav>
  );
}
