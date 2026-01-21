import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { WidgetShowcase } from '@/components/sections/widget-showcase'
import { CTASection } from '@/components/sections/cta-section'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)

  return (
    <>
      <HeroSection dict={dict} locale={locale} />
      <FeaturesSection dict={dict} />
      <WidgetShowcase dict={dict} />
      <CTASection dict={dict} locale={locale} />
    </>
  )
}
