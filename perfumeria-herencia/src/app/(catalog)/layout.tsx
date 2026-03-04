import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFlotante } from '@/components/layout/WhatsAppFlotante'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo - Herencia Perfumería',
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFlotante />
    </>
  )
}
