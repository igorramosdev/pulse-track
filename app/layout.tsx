import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'PulseTrack - Real-Time Visitor Analytics',
    template: '%s | PulseTrack',
  },
  description: 'Free real-time visitor counter and analytics. Know exactly who is on your website right now with beautiful, embeddable widgets.',
  keywords: ['visitor counter', 'real-time analytics', 'website statistics', 'live visitors', 'web analytics', 'free counter'],
  authors: [{ name: 'PulseTrack' }],
  creator: 'PulseTrack',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pulsetrack.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'pt_BR',
    siteName: 'PulseTrack',
    title: 'PulseTrack - Real-Time Visitor Analytics',
    description: 'Free real-time visitor counter and analytics. Know exactly who is on your website right now.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseTrack - Real-Time Visitor Analytics',
    description: 'Free real-time visitor counter and analytics for your website.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
