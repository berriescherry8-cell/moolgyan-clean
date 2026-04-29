"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { translations } from './locales';

type Language = 'en' | 'hi';
type TFunction = (key: string) => string;

type LocaleContextType = {
  lang: Language;
  locale: Language;
  t: TFunction;
  setLang: (lang: Language) => void;
  setLocale: (lang: Language) => void;
};

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moolgyan-language') as Language | null;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('moolgyan-language', newLang);
    // Also update html lang attribute
    document.documentElement.lang = newLang;
  };

  const t: TFunction = (key: string) => {
    const dict = translations[lang] as Record<string, string>;
    return dict[key] || key;
  };

  const value = {
    lang,
    locale: lang,       // alias for compatibility
    t,
    setLang,
    setLocale: setLang, // alias for compatibility
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  return context;
}
