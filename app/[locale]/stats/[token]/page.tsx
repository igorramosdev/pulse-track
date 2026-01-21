import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { StatsDashboard } from '@/components/stats/stats-dashboard'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { isValidToken } from '@/lib/token'
import { Activity, Globe } from 'lucide-react'
import Link from 'next/link'

interface TokenStatsPageProps {
  params: Promise<{ locale: string; token: string }>
}

export async function generateMetadata({ params }: TokenStatsPageProps): Promise<Metadata> {
  const { locale, token } = await params
  const dict = getDictionary(locale as Locale)
  
  return {
    title: `Stats for ${token}`,
    description: `Real-time visitor statistics for ${token}`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function TokenStatsPage({ params }: TokenStatsPageProps) {
  const { locale, token } = await params
  const dict = getDictionary(locale as Locale)

  // Validate token format
  if (!isValidToken(token)) {
    notFound()
  }

  // Check if token exists
  const supabase = getSupabaseAdminClient()
  const { data: tokenData, error } = await supabase
    .from('tokens')
    .select('token, site_name, site_url, is_blocked')
    .eq('token', token)
    .single()

  if (error || !tokenData || tokenData.is_blocked) {
    notFound()
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:mb-0 sm:mr-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {tokenData.site_name || `Stats for ${token}`}
              </h1>
              {tokenData.site_url && (
                <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground sm:justify-start">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={tokenData.site_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    {tokenData.site_url}
                  </a>
                </div>
              )}
              <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start">
                <Link
                  href={`/${locale}/stats/${token}`}
                  className="text-sm font-medium text-primary"
                >
                  Overview
                </Link>
                <Link
                  href={`/${locale}/stats/readers/${token}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Readers
                </Link>
              </div>
            </div>
          </div>
        </div>

        <StatsDashboard token={token} dict={dict} />
      </div>
    </div>
  )
}
