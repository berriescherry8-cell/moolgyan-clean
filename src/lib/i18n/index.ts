import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCallback } from 'react';
import { translations } from './locales';

type Locale = 'en' | 'hi';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'hi',
      setLocale: (locale) => {
        set({ locale });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: 'locale-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useLocale() {
  const { locale, setLocale } = useLocaleStore();
  const t = useCallback((key: string) => {
    return locale === 'hi' 
      ? (translations.hi[key as keyof typeof translations.hi] || key)
      : (translations.en[key as keyof typeof translations.en] || key);
  }, [locale]);

  return { t, setLocale, locale };
}

