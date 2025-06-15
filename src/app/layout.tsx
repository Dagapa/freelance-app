import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/shared/providers/theme-provider'
import { Toaster } from 'sonner'
import { SupabaseProvider } from '@/shared/providers/supabase-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Freelance Finance',
  description: 'Herramientas financieras para freelancers',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <ThemeProvider>
          <SupabaseProvider>
            {children}
            <Toaster position="top-center" richColors />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
