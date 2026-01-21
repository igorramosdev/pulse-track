'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { Dictionary } from '@/lib/types'

interface HeaderProps {
  dict: Dictionary
  locale: string
}

export function Header({ dict, locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">PulseTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href={`/${locale}`} 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.nav.home}
          </Link>
          <Link 
            href={`/${locale}/get-started`} 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.nav.getStarted}
          </Link>
          <Link 
            href={`/${locale}/stats`} 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.nav.stats}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
            <Link 
              href="/en" 
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                locale === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </Link>
            <Link 
              href="/pt" 
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                locale === 'pt' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              PT
            </Link>
          </div>
          <Button asChild>
            <Link href={`/${locale}/get-started`}>{dict.hero.cta}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href={`/${locale}`}
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${locale}/get-started`}
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.getStarted}
            </Link>
            <Link
              href={`/${locale}/stats`}
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.stats}
            </Link>
            <div className="flex items-center gap-2 px-3 py-2">
              <Link href="/en" className={`rounded-md px-3 py-1.5 text-sm font-medium ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                EN
              </Link>
              <Link href="/pt" className={`rounded-md px-3 py-1.5 text-sm font-medium ${locale === 'pt' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                PT
              </Link>
            </div>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/${locale}/get-started`}>{dict.hero.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
