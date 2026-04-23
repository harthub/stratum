import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Bebas_Neue } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'STRATUM — Critical Minerals & the AI Infrastructure Boom',
  description: 'A cross-asset research tool analyzing critical mineral supply chains, commodity forex transmission, and mining equities tied to the AI infrastructure buildout.',
  authors: [{ name: 'Izak Trevino' }],
  openGraph: {
    title: 'STRATUM — Critical Minerals & the AI Infrastructure Boom',
    description: 'Cross-asset analysis of how AI demand is reshaping commodity markets, producer-nation currencies, and mining equities.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} ${bebasNeue.variable}`}>
      <body>{children}</body>
    </html>
  )
}
