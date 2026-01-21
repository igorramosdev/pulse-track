'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Users, Globe, TrendingUp } from 'lucide-react'
import { WidgetPreview } from '@/components/widgets/widget-preview'
import type { Dictionary } from '@/lib/types'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  dict: Dictionary
  locale: string
}

export function HeroSection({ dict, locale }: HeroSectionProps) {
  const [count, setCount] = useState(0)
  const targetCount = 127
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = targetCount / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setCount(targetCount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-chart-2/10 blur-3xl animate-float animation-delay-300" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left content */}
          <div className="flex flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-scale-in backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Free forever. No signup required.
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl animate-slide-in-left">
              <span className="gradient-text">{dict.hero.title.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              <span className="text-foreground">{dict.hero.title.split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="mt-8 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl animate-slide-in-left animation-delay-200">
              {dict.hero.subtitle}
            </p>

            {/* Stats row */}
            <div className="mt-10 flex flex-wrap gap-8 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Sites</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">50M+</div>
                  <div className="text-sm text-muted-foreground">Pageviews</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in-up animation-delay-400">
              <Button asChild size="lg" className="gap-2 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link href={`/${locale}/get-started`}>
                  {dict.hero.cta}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base bg-transparent border-border/50 hover:bg-accent/50 backdrop-blur-sm">
                <Link href={`/${locale}/stats`}>
                  <Play className="h-5 w-5" />
                  {dict.hero.demo}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right content - Widget showcase */}
          <div className="relative flex items-center justify-center lg:justify-end animate-slide-in-right">
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind browser */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-chart-2/20 to-primary/20 blur-2xl animate-gradient opacity-60" />
              
              {/* Browser mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/30 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="ml-4 flex-1 rounded-lg bg-background/50 px-4 py-1.5 text-xs text-muted-foreground font-mono">
                    yourwebsite.com
                  </div>
                </div>
                <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/30 to-background/50 p-8">
                  {/* Simulated page content */}
                  <div className="space-y-4">
                    <div className="h-5 w-2/3 rounded-lg bg-secondary/50 animate-shimmer" />
                    <div className="h-3 w-full rounded bg-secondary/30" />
                    <div className="h-3 w-5/6 rounded bg-secondary/30" />
                    <div className="h-3 w-4/6 rounded bg-secondary/30" />
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="h-32 w-full rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/20" />
                  </div>
                  
                  {/* Widget positioned at bottom right */}
                  <div className="absolute bottom-6 right-6 animate-float">
                    <div className="animate-glow rounded-full">
                      <WidgetPreview 
                        variant="pill" 
                        color="#10b981" 
                        count={count} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating widget examples */}
              <div className="absolute -left-8 top-1/4 animate-float animation-delay-100">
                <div className="hover-lift rounded-xl shadow-xl">
                  <WidgetPreview variant="badge" color="#1f2937" count={42} />
                </div>
              </div>
              <div className="absolute -right-8 top-1/2 animate-float animation-delay-400">
                <div className="hover-lift rounded-xl shadow-xl">
                  <WidgetPreview variant="card" color="#10b981" count={89} />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-primary/20 animate-pulse-dot" />
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full border border-chart-2/20 animate-pulse-dot animation-delay-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
