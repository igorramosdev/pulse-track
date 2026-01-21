import { Zap, UserX, Shield, Palette } from 'lucide-react'
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
    },
    {
      icon: UserX,
      title: dict.features.noSignup.title,
      description: dict.features.noSignup.description,
    },
    {
      icon: Shield,
      title: dict.features.privacy.title,
      description: dict.features.privacy.description,
    },
    {
      icon: Palette,
      title: dict.features.customizable.title,
      description: dict.features.customizable.description,
    },
  ]

  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.features.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
