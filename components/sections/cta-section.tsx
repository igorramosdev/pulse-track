'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Check } from 'lucide-react'
import type { Dictionary } from '@/lib/types'

interface CTASectionProps {
  dict: Dictionary
  locale: string
}

export function CTASection({ dict, locale }: CTASectionProps) {
  const benefits = [
    'No credit card required',
    'Setup in 30 seconds',
    'Unlimited pageviews',
    'Real-time updates',
  ]

  return (
    <section className="relative border-t border-border/50 py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-chart-2/10 blur-3xl animate-float animation-delay-300" />
      
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 animate-scale-in backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Ready to get started?
        </div>
        
        <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up">
          Start tracking visitors
          <br />
          <span className="gradient-text">in 30 seconds</span>
        </h2>
        
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl animate-fade-in-up animation-delay-100">
          No account needed. Just pick a style, copy the code, and paste it on your site.
        </p>

        {/* Benefits */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-200">
          {benefits.map((benefit) => (
            <div 
              key={benefit}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Check className="h-3 w-3" />
              </div>
              {benefit}
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
          <Button asChild size="lg" className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all animate-glow">
            <Link href={`/${locale}/get-started`}>
              <Zap className="h-5 w-5" />
              {dict.hero.cta}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
            10,000+ sites trust us
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-dot animation-delay-200" />
            99.9% uptime
          </div>
        </div>
      </div>
    </section>
  )
}
