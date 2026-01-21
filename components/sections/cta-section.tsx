import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/lib/types'

interface CTASectionProps {
  dict: Dictionary
  locale: string
}

export function CTASection({ dict, locale }: CTASectionProps) {
  return (
    <section className="border-t border-border bg-primary/5 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Start tracking visitors in 30 seconds
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          No account needed. Just pick a style, copy the code, and paste it on your site.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="gap-2">
            <Link href={`/${locale}/get-started`}>
              {dict.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
