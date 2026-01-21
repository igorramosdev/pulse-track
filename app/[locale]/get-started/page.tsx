import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { WidgetWizard } from '@/components/wizard/widget-wizard'

interface GetStartedPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: GetStartedPageProps): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  
  return {
    title: dict.wizard.title,
    description: dict.wizard.subtitle,
    alternates: {
      canonical: `/${locale}/get-started`,
      languages: {
        en: '/en/get-started',
        pt: '/pt/get-started',
      },
    },
  }
}

export default async function GetStartedPage({ params }: GetStartedPageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.wizard.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {dict.wizard.subtitle}
          </p>
        </div>
        
        <WidgetWizard dict={dict} locale={locale} />
      </div>
    </div>
  )
}
