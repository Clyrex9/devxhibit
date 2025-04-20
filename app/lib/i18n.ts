import { locales } from '../../locales/index';
import type { Locale } from '../../locales/types';

// Typesafe translation helper
export function getTranslation(
  locale: Locale,
  ns: keyof typeof locales["en"] | string,
  key: string
): string {
  const dict = locales[locale] as Record<string, Record<string, string>>;
  return dict?.[ns]?.[key] || key;
}
