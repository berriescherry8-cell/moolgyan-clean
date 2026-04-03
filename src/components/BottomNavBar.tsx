
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavItems } from '@/lib/nav-items';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useLocale();
  // Filter for the 5 main items for the bottom nav bar
  const mainLinks = ['/', '/live-satsang', '/satsang', '/photos', '/books'];
  
  const navItems = getNavItems(t).filter(item => 
    mainLinks.includes(item.href)
  ).sort((a, b) => mainLinks.indexOf(a.href) - mainLinks.indexOf(b.href));

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          // Ensure consistent icons, especially for Home
          const Icon = item.href === '/' ? Home : item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-1 hover:bg-muted/50 group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
