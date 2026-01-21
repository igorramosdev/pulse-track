import type { Metadata } from 'next'
import { Activity, Shield, Zap, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'pt' ? 'Sobre o PulseTrack' : 'About PulseTrack',
    description: locale === 'pt' 
      ? 'Conheça o PulseTrack - contador de visitantes em tempo real gratuito.'
      : 'Learn about PulseTrack - free real-time visitor counter.',
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const isPt = locale === 'pt'

  const features = isPt ? [
    {
      icon: Zap,
      title: 'Rápido e Leve',
      description: 'Nosso script pesa menos de 2KB e não afeta o desempenho do seu site.',
    },
    {
      icon: Shield,
      title: 'Privacidade em Primeiro Lugar',
      description: 'Não rastreamos IPs, cookies ou dados pessoais dos seus visitantes.',
    },
    {
      icon: Globe,
      title: 'Funciona em Qualquer Lugar',
      description: 'Compatível com qualquer site - HTML, WordPress, React, e mais.',
    },
    {
      icon: Activity,
      title: 'Tempo Real',
      description: 'Veja visitantes entrando e saindo do seu site instantaneamente.',
    },
  ] : [
    {
      icon: Zap,
      title: 'Fast and Lightweight',
      description: 'Our script is under 2KB and does not affect your site performance.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'We do not track IPs, cookies, or personal data from your visitors.',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Compatible with any website - HTML, WordPress, React, and more.',
    },
    {
      icon: Activity,
      title: 'Real-Time',
      description: 'See visitors arriving and leaving your site instantly.',
    },
  ]

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isPt ? 'Sobre o PulseTrack' : 'About PulseTrack'}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {isPt 
              ? 'Contador de visitantes em tempo real, gratuito e focado em privacidade.'
              : 'Free, privacy-focused real-time visitor counter.'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">
            {isPt ? 'Por que criamos o PulseTrack?' : 'Why did we build PulseTrack?'}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {isPt 
              ? 'Acreditamos que proprietários de sites merecem saber quantas pessoas estão visitando seu site - sem complicações, sem custos e sem comprometer a privacidade dos visitantes. O PulseTrack oferece exatamente isso: estatísticas em tempo real de forma simples e transparente.'
              : 'We believe website owners deserve to know how many people are visiting their site - without hassle, without cost, and without compromising visitor privacy. PulseTrack delivers exactly that: real-time stats in a simple, transparent way.'}
          </p>
        </div>
      </div>
    </div>
  )
}
