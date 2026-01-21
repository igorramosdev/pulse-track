import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulsetrack.app'
  
  const routes = ['', '/get-started', '/stats']
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // Add routes for each locale
  for (const locale of locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            pt: `${baseUrl}/pt${route}`,
          },
        },
      })
    }
  }

  return sitemap
}
