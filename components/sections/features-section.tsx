'use client'

import { Zap, UserX, Shield, Palette, BarChart3, Code2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Dictionary } from '@/lib/types'

interface FeaturesSectionProps {
  dict: Dictionary
}

export function FeaturesSection({ dict }: FeaturesSectionProps) {
  const features = [
    {
      icon: Zap,
      title: dict.features.realtime.title,
      description: dict.features.realtime.description,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-500',
    },
    {
      icon: UserX,
      title: dict.features.noSignup.title,
      description: dict.features.noSignup.description,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      icon: Shield,
      title: dict.features.privacy.title,
      description: dict.features.privacy.description,
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
    },
    {
      icon: Palette,
      title: dict.features.customizable.title,
      description: dict.features.customizable.description,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track pageviews, top pages, visitor timelines and more with beautiful dashboards.',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-500',
    },
    {
      icon: Code2,
      title: 'Easy Integration',
      description: 'Just copy one line of code and paste it on your site. Works with any platform.',
      gradient: 'from-slate-500/20 to-zinc-500/20',
      iconColor: 'text-slate-500',
    },
  ]

  return (
    <section className="relative border-t border-border/50 py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.features.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to understand your website traffic, without the complexity.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover-lift"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              <CardContent className="relative p-8">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
