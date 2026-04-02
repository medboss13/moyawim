import type { Metadata, Viewport } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Moyawim.ma - Trouvez le bon travailleur en 2 minutes',
  description: 'La première plateforme marocaine qui connecte les travailleurs journaliers qualifiés aux particuliers et entreprises. Simple, sécurisé, immédiat.',
  keywords: ['travailleur', 'emploi', 'maroc', 'journalier', 'services', 'moyawim'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1f3c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
