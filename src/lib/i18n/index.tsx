"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

import { translations } from './locales';

type Language = 'en' | 'hi';
type TFunction = (key: string) => string;

type LocaleContextType = {
  lang: Language;
  t: TFunction;
  setLang: (lang: Language) => void;
};

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const t: TFunction = (key: string) => {
    const dict = translations[lang] as Record<string, string>;
    return dict[key] || key;
  };

  const value = {
    lang,
    t,
    setLang,
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
