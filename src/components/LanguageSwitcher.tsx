'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { setLocale, locale, t } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="gap-2 flex items-center">
          <span>{locale === 'en' ? 'Language' : 'भाषा'}</span>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t.change_language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          disabled={locale === 'en'}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('hi')}
          disabled={locale === 'hi'}
        >
          हिन्दी (Hindi)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}