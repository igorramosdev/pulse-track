'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, ExternalLink } from 'lucide-react'
import type { Dictionary, TopPage } from '@/lib/types'

interface ReadersDashboardProps {
  token: string
  dict: Dictionary
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ReadersDashboard({ token, dict }: ReadersDashboardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: onlineData } = useSWR(
    mounted ? `/api/online?token=${token}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: topPagesData } = useSWR(
    mounted ? `/api/top-pages?token=${token}&limit=50` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const online = onlineData?.online ?? 0
  const topPages: TopPage[] = topPagesData?.pages ?? []

  // Calculate total visitors across all pages
  const totalVisitors = topPages.reduce((sum, p) => sum + Number(p.visitor_count), 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{online}</div>
              <div className="text-sm text-muted-foreground">{dict.stats.online}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-chart-2/10 p-3">
              <FileText className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <div className="text-3xl font-bold">{topPages.length}</div>
              <div className="text-sm text-muted-foreground">Active Pages</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-chart-3/10 p-3">
              <Users className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <div className="text-3xl font-bold">{totalVisitors}</div>
              <div className="text-sm text-muted-foreground">Total Readers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {dict.stats.topPages}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {dict.stats.noData}
            </div>
          ) : (
            <div className="space-y-2">
              {topPages.map((page, i) => {
                const percentage = totalVisitors > 0 
                  ? (Number(page.visitor_count) / totalVisitors) * 100 
                  : 0
                return (
                  <div
                    key={page.path}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                  >
                    {/* Background progress bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative flex items-center gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium" title={page.path}>
                            {page.path || '/'}
                          </span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of total traffic
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {page.visitor_count}
                          </div>
                          <div className="text-xs text-muted-foreground">readers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
