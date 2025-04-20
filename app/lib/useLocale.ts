"use client";
import { useState, useEffect, useRef } from 'react';
import type { Locale } from '../../locales/types';

export function useLocale(): [Locale, (l: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('locale') as Locale) || 'en';
    }
    return 'en';
  });
  const prevLocale = useRef(locale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
      if (prevLocale.current !== locale) {
        prevLocale.current = locale;
        window.location.reload(); // Auto-reload on language change
      }
    }
  }, [locale]);

  return [locale, setLocale];
}
