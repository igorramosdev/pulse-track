import { en } from './dictionaries/en'
import { pt } from './dictionaries/pt'
import type { Dictionary, Locale } from '@/lib/types'

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  pt,
}

export const locales: Locale[] = ['en', 'pt']
export const defaultLocale: Locale = 'en'

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale]
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, priority = 'q=1'] = lang.trim().split(';')
      return {
        code: code.toLowerCase().split('-')[0],
        priority: parseFloat(priority.replace('q=', '')) || 1,
      }
    })
    .sort((a, b) => b.priority - a.priority)

  for (const lang of languages) {
    if (locales.includes(lang.code as Locale)) {
      return lang.code as Locale
    }
  }

  return defaultLocale
}

export function getAlternateLinks(currentPath: string): { hrefLang: string; href: string }[] {
  return locales.map(locale => ({
    hrefLang: locale,
    href: `/${locale}${currentPath}`,
  }))
}
