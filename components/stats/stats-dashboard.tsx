'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, FileText, TrendingUp, Users } from 'lucide-react'
import type { Dictionary, TopPage, TimelinePoint } from '@/lib/types'

interface StatsDashboardProps {
  token: string
  dict: Dictionary
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function StatsDashboard({ token, dict }: StatsDashboardProps) {
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
    mounted ? `/api/top-pages?token=${token}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: timelineData } = useSWR(
    mounted ? `/api/timeline?token=${token}` : null,
    fetcher,
    { refreshInterval: 10000 }
  )

  const online = onlineData?.online ?? 0
  const topPages: TopPage[] = topPagesData?.pages ?? []
  const timeline: TimelinePoint[] = timelineData?.timeline ?? []

  // Calculate max for timeline chart
  const maxVisitors = Math.max(...timeline.map(t => t.visitor_count), 1)

  return (
    <div className="space-y-6">
      {/* Online Counter Hero */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            {dict.stats.online}
          </div>
          <div className="text-6xl font-bold text-primary sm:text-7xl">
            {online}
          </div>
          <div className="mt-2 text-muted-foreground">{dict.stats.visitors}</div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{dict.stats.topPages}</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {dict.stats.noData}
              </div>
            ) : (
              <div className="space-y-3">
                {topPages.slice(0, 10).map((page, i) => (
                  <div key={page.path} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {i + 1}
                    </span>
                    <div className="flex-1 truncate text-sm" title={page.path}>
                      {page.path || '/'}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <Users className="h-3 w-3" />
                      {page.visitor_count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{dict.stats.timeline}</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {dict.stats.noData}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex h-40 items-end gap-1">
                  {timeline.slice(-30).map((point, i) => {
                    const height = (point.visitor_count / maxVisitors) * 100
                    const time = new Date(point.minute).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    return (
                      <div
                        key={point.minute}
                        className="group relative flex-1"
                        title={`${time}: ${point.visitor_count} visitors`}
                      >
                        <div
                          className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs shadow-lg group-hover:block">
                          {point.visitor_count} @ {time}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30 min ago</span>
                  <span>Now</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{online}</div>
              <div className="text-xs text-muted-foreground">Active Now</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <FileText className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <div className="text-2xl font-bold">{topPages.length}</div>
              <div className="text-xs text-muted-foreground">Active Pages</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-chart-3/10 p-2">
              <TrendingUp className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {timeline.length > 0
                  ? Math.max(...timeline.map(t => t.visitor_count))
                  : 0}
              </div>
              <div className="text-xs text-muted-foreground">Peak (30m)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
