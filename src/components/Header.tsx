'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale } from '@/lib/i18n';
import { Menu } from 'lucide-react';
import { useAdminAuthStore } from '@/lib/adminAuthStore';

export default function Header() {
  const { t } = useLocale();
const { isAuthenticated } = useAdminAuthStore();
=======
import { useLocale } from '@/lib/i18n';
import { Menu } from 'lucide-react';

export default function Header() {
  const { t } = useLocale();
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/30 px-4 md:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
<<<<<<< HEAD
        <SidebarTrigger asChild>
          <Button 
            variant="default" 
            size="icon" 
            className="bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20 border-none transition-all duration-300 active:scale-95"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SidebarTrigger>
=======
        {/* Sidebar Trigger - Fixed with single child */}
        <SidebarTrigger className="bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20 border-none transition-all duration-300 active:scale-95">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SidebarTrigger>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

        <Link href="/" className="flex items-center gap-2 ml-2">
          <Image
            src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png"
            alt="Mool Gyan Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
            unoptimized
          />
          <span className="text-xl font-bold font-headline text-foreground">
<<<<<<< HEAD
            {t('app_name')}
=======
            {t('app_name') || "Mool Gyan"}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
          </span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
<<<<<<< HEAD
        <Button asChild size="sm" className="bg-amber-500 text-black hover:bg-amber-600 hidden sm:flex">
          <Link href="/deeksha-aavedan">दीक्षा आवेदन</Link>
        </Button>

        <LanguageSwitcher />
=======
        <Link href="/deeksha-aavedan" className="bg-amber-500 text-black hover:bg-amber-600 px-4 py-2 rounded-md font-medium shadow-lg shadow-amber-500/20 transition-all duration-300 hidden sm:flex">
          दीक्षा आवेदन
        </Link>

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      </div>
    </header>
  );
}