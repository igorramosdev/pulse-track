'use client'

import { useState } from 'react'
import { WidgetPreview } from '@/components/widgets/widget-preview'
import { Card } from '@/components/ui/card'
import type { WidgetVariant, Dictionary } from '@/lib/types'

interface WidgetShowcaseProps {
  dict: Dictionary
}

const widgetTypes: { variant: WidgetVariant; color: string }[] = [
  { variant: 'pill', color: '#10b981' },
  { variant: 'badge', color: '#1f2937' },
  { variant: 'card', color: '#10b981' },
  { variant: 'floating', color: '#3b82f6' },
]

export function WidgetShowcase({ dict }: WidgetShowcaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<WidgetVariant>('pill')

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Style
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a widget that matches your website design
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {widgetTypes.map(({ variant, color }) => (
            <Card
              key={variant}
              className={`cursor-pointer p-6 transition-all hover:shadow-lg ${
                selectedVariant === variant
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => setSelectedVariant(variant)}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 items-center justify-center">
                  <WidgetPreview variant={variant} color={color} count={127} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold capitalize">
                    {dict.wizard.widgetTypes[variant]}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {variant === 'pill' && 'Perfect for footers'}
                    {variant === 'badge' && 'Compact & minimal'}
                    {variant === 'card' && 'Stand-alone display'}
                    {variant === 'floating' && 'Always visible'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
