import { create } from 'zustand';
<<<<<<< HEAD
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
=======
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
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: 'locale-storage',
<<<<<<< HEAD
=======
      storage: createJSONStorage(() => localStorage),
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
    }
  )
);

export function useLocale() {
<<<<<<< HEAD
  const { t, setLocale, locale } = useLocaleStore();
=======
  const { locale, setLocale } = useLocaleStore();
  const t = useCallback((key: string) => {
    return locale === 'hi' 
      ? (translations.hi[key as keyof typeof translations.hi] || key)
      : (translations.en[key as keyof typeof translations.en] || key);
  }, [locale]);

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  return { t, setLocale, locale };
}

