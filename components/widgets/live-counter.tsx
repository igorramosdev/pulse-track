'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { WidgetVariant } from '@/lib/types'

interface LiveCounterProps {
  token: string
  variant?: WidgetVariant
  color?: string
  size?: 'small' | 'large'
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function LiveCounter({ 
  token, 
  variant = 'pill', 
  color = '#10b981',
  size = 'small' 
}: LiveCounterProps) {
  const [mounted, setMounted] = useState(false)
  
  const { data, error } = useSWR(
    mounted ? `/api/online?token=${token}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = data?.online ?? '...'

  const renderPill = () => (
    <div 
      className={`inline-flex items-center gap-2 rounded-full font-medium text-white shadow-lg transition-all ${
        size === 'small' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'
      }`}
      style={{ backgroundColor: color }}
    >
      <span className="h-2 w-2 rounded-full bg-white animate-pulse-dot" />
      <span>{count} online</span>
    </div>
  )

  const renderBadge = () => (
    <div 
      className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" />
      <span>{count}</span>
    </div>
  )

  const renderCard = () => (
    <div className="inline-flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-lg">
      <div className="text-3xl font-bold" style={{ color }}>
        {count}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">visitors online</div>
    </div>
  )

  const renderFloating = () => (
    <div 
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-xl"
      style={{ backgroundColor: color }}
    >
      <span className="h-2 w-2 rounded-full bg-white animate-pulse-dot" />
      <span>{count} online</span>
    </div>
  )

  if (error) return null

  switch (variant) {
    case 'badge':
      return renderBadge()
    case 'card':
      return renderCard()
    case 'floating':
      return renderFloating()
    default:
      return renderPill()
  }
}
