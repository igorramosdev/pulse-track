'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Dictionary } from '@/lib/types'

interface HeaderProps {
  dict: Dictionary
  locale: string
}

export function Header({ dict, locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-primary animate-glow opacity-50" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Pulse<span className="text-primary">Track</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link 
            href={`/${locale}`} 
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
          >
            {dict.nav.home}
          </Link>
          <Link 
            href={`/${locale}/get-started`} 
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
          >
            {dict.nav.getStarted}
          </Link>
          <Link 
            href={`/${locale}/stats`} 
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
          >
            {dict.nav.stats}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 rounded-xl border border-border/50 bg-secondary/30 p-1 backdrop-blur-sm">
            <Link 
              href="/en" 
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                locale === 'en' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </Link>
            <Link 
              href="/pt" 
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                locale === 'pt' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              PT
            </Link>
          </div>
          <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Link href={`/${locale}/get-started`}>{dict.hero.cta}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:bg-accent/50 transition-colors md:hidden"
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
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden animate-fade-in-up">
          <div className="space-y-1 px-4 py-4">
            <Link
              href={`/${locale}`}
              className="block rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${locale}/get-started`}
              className="block rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.getStarted}
            </Link>
            <Link
              href={`/${locale}/stats`}
              className="block rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.stats}
            </Link>
            <div className="flex items-center gap-2 px-4 py-3">
              <Link href="/en" className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${locale === 'en' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-secondary-foreground'}`}>
                English
              </Link>
              <Link href="/pt" className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${locale === 'pt' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-secondary-foreground'}`}>
                Portugues
              </Link>
            </div>
            <div className="pt-3 px-4">
              <Button asChild className="w-full shadow-lg shadow-primary/20">
                <Link href={`/${locale}/get-started`}>{dict.hero.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
