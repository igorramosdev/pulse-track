'use client'

import { useState } from 'react'
import { WidgetPreview } from '@/components/widgets/widget-preview'
import { Card } from '@/components/ui/card'
import { Check, Palette } from 'lucide-react'
import type { WidgetVariant, Dictionary } from '@/lib/types'

interface WidgetShowcaseProps {
  dict: Dictionary
}

const widgetTypes: { variant: WidgetVariant; color: string; description: string }[] = [
  { variant: 'pill', color: '#10b981', description: 'Perfect for footers and sidebars' },
  { variant: 'badge', color: '#1f2937', description: 'Compact and minimal design' },
  { variant: 'card', color: '#10b981', description: 'Stand-alone display card' },
  { variant: 'floating', color: '#3b82f6', description: 'Always visible overlay' },
]

export function WidgetShowcase({ dict }: WidgetShowcaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<WidgetVariant>('pill')

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-chart-2/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-chart-2/20 bg-chart-2/5 px-4 py-1.5 text-sm font-medium text-chart-2 mb-6">
            <Palette className="h-4 w-4" />
            Widget Styles
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choose Your Style
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a widget that matches your website design perfectly
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {widgetTypes.map(({ variant, color, description }) => (
            <Card
              key={variant}
              className={`group relative cursor-pointer overflow-hidden p-6 transition-all duration-300 hover-lift ${
                selectedVariant === variant
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                  : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-primary/5'
              }`}
              onClick={() => setSelectedVariant(variant)}
            >
              {/* Selected indicator */}
              {selectedVariant === variant && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground animate-scale-in">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-24 items-center justify-center">
                  <div className={`transition-transform duration-300 ${selectedVariant === variant ? 'scale-110' : 'group-hover:scale-105'}`}>
                    <WidgetPreview variant={variant} color={color} count={127} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold capitalize">
                    {dict.wizard.widgetTypes[variant]}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Preview section */}
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 blur-2xl animate-gradient" />
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Live Preview</p>
              </div>
              <div className="flex items-center justify-center min-h-[100px]">
                <div className="animate-scale-in" key={selectedVariant}>
                  <WidgetPreview 
                    variant={selectedVariant} 
                    color={selectedVariant === 'badge' ? '#1f2937' : '#10b981'} 
                    count={127} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
