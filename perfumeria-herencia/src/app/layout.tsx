import type { Metadata } from 'next'
import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HERENCIA — Perfumería de Autor',
  description: 'Boutique de fragancias elegantes. Perfumes originales y réplicas premium en Guarne, Antioquia. Cada fragancia cuenta tu historia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
