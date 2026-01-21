import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { StatsDashboard } from '@/components/stats/stats-dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Activity } from 'lucide-react'

interface StatsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: StatsPageProps): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  
  return {
    title: dict.stats.title,
    description: 'Live visitor statistics demo. See real-time analytics in action.',
    alternates: {
      canonical: `/${locale}/stats`,
      languages: {
        en: '/en/stats',
        pt: '/pt/stats',
      },
    },
  }
}

export default async function StatsPage({ params }: StatsPageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)

  // Demo token for the main site stats
  const demoToken = 'demo'

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.stats.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Demo dashboard showing real-time visitor data for this site
          </p>
        </div>

        <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4 text-sm">
            <span className="rounded-full bg-amber-500/10 p-1">
              <Activity className="h-4 w-4 text-amber-600" />
            </span>
            <span>
              This is a demo dashboard. Create your own widget at{' '}
              <a href={`/${locale}/get-started`} className="font-medium text-primary hover:underline">
                /get-started
              </a>{' '}
              to track your website.
            </span>
          </CardContent>
        </Card>

        <StatsDashboard token={demoToken} dict={dict} />
      </div>
    </div>
  )
}
