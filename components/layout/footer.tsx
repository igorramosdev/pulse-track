import Link from 'next/link'
import { Activity } from 'lucide-react'
import type { Dictionary } from '@/lib/types'

interface FooterProps {
  dict: Dictionary
  locale: string
}

export function Footer({ dict, locale }: FooterProps) {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">PulseTrack</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              href={`/${locale}/privacy`} 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.footer.privacy}
            </Link>
            <Link 
              href={`/${locale}/terms`} 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.footer.terms}
            </Link>
            <Link 
              href={`/${locale}/about`} 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.footer.about}
            </Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} PulseTrack. Open source.
          </p>
        </div>
      </div>
    </footer>
  )
}
