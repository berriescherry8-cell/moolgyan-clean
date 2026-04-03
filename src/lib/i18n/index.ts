import { create } from 'zustand';
import { translations } from './locales';
import { persist } from 'zustand/middleware';

interface LocaleState {
  locale: 'en' | 'hi';
  t: (key: string) => string;
  setLocale: (locale: 'en' | 'hi') => void;
}

export const useLocaleStore = create(
  persist<LocaleState>(
    (set, get) => ({
      locale: (typeof window !== 'undefined' ? localStorage.getItem('locale') as 'en' | 'hi' || 'hi' : 'hi'),
      t: (key: string) => {
        const state = get();
        return state.locale === 'hi' ? (translations.hi[key as keyof typeof translations.hi] || key) : (translations.en[key as keyof typeof translations.en] || key);
      },
      setLocale: (locale) => {
        set({ locale });
        if (typeof window !== 'undefined') {
          localStorage.setItem('locale', locale);
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: 'locale-storage',
    }
  )
);

export function useLocale() {
  const { t, setLocale, locale } = useLocaleStore();
  return { t, setLocale, locale };
}

