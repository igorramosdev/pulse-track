'use client'

import type { WidgetVariant, TabPosition } from '@/lib/types'

interface WidgetPreviewProps {
  variant: WidgetVariant
  color: string
  size?: 'small' | 'large'
  position?: TabPosition
  count?: number
}

export function WidgetPreview({ 
  variant, 
  color, 
  size = 'small', 
  position = 'bottom-right',
  count = 42 
}: WidgetPreviewProps) {
  const renderPill = () => (
    <div 
      className={`inline-flex items-center gap-2 rounded-full font-medium text-white shadow-lg ${
        size === 'small' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'
      }`}
      style={{ backgroundColor: color }}
    >
      <span 
        className="h-2 w-2 rounded-full bg-white animate-pulse-dot"
      />
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
      <div 
        className="text-3xl font-bold"
        style={{ color }}
      >
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

  const renderWidget = () => {
    switch (variant) {
      case 'pill':
        return renderPill()
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

  return (
    <div className="flex items-center justify-center">
      {renderWidget()}
    </div>
  )
}
