import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import { WidgetPreview } from '@/components/widgets/widget-preview'
import type { Dictionary } from '@/lib/types'

interface HeroSectionProps {
  dict: Dictionary
  locale: string
}

export function HeroSection({ dict, locale }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              Free forever. No signup required.
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {dict.hero.title}
            </h1>
            
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
              {dict.hero.subtitle}
            </p>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/${locale}/get-started`}>
                  {dict.hero.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                <Link href={`/${locale}/stats`}>
                  <Play className="h-4 w-4" />
                  {dict.hero.demo}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right content - Widget showcase */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Browser mockup */}
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                    yourwebsite.com
                  </div>
                </div>
                <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/50 to-background p-6">
                  {/* Simulated page content */}
                  <div className="space-y-3">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-full rounded bg-secondary/70" />
                    <div className="h-3 w-5/6 rounded bg-secondary/70" />
                    <div className="h-3 w-4/6 rounded bg-secondary/70" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-24 w-full rounded-lg bg-secondary/50" />
                  </div>
                  
                  {/* Widget positioned at bottom right */}
                  <div className="absolute bottom-4 right-4 animate-fade-in-up">
                    <WidgetPreview 
                      variant="pill" 
                      color="#10b981" 
                      count={127} 
                    />
                  </div>
                </div>
              </div>

              {/* Floating widget examples */}
              <div className="absolute -left-4 top-1/4 animate-fade-in-up animation-delay-200">
                <WidgetPreview variant="badge" color="#1f2937" count={42} />
              </div>
              <div className="absolute -right-4 top-1/2 animate-fade-in-up animation-delay-300">
                <WidgetPreview variant="card" color="#10b981" count={89} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
