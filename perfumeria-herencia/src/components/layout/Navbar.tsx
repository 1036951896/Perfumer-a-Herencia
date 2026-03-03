'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Segment } from '@/types'
import { esSegmentoValido } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [segment, setSegment] = useState<Segment | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('segment')
    if (saved && esSegmentoValido(saved)) {
      setSegment(saved)
    }
  }, [])

  useEffect(() => {
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const saved = localStorage.getItem('segment')
      if (saved && esSegmentoValido(saved)) {
        setSegment(saved)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => removeEventListener('storage', handleStorageChange)
  }, [])

  const handleChangeSegment = (newSegment: Segment) => {
    localStorage.setItem('segment', newSegment)
    setSegment(newSegment)
    router.push(`/${newSegment}`)
    setIsMenuOpen(false)
  }

  const isOriginal = segment === 'original'
  const isReplicas = segment === 'replicas'

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={segment ? `/${segment}` : '/'} className="flex items-center">
            <Image 
              src="/logo_minimalista.png"
              alt="Herencia"
              width={80}
              height={80}
              className="object-contain opacity-90"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {segment && (
              <>
                <Link
                  href={`/${segment}`}
                  className="text-dark hover:text-primary transition-colors"
                >
                  Catálogo
                </Link>
              </>
            )}

            {/* Segment Switcher */}
            {segment && (
              <div className="flex items-center gap-2 border-l border-dark/10 pl-6">
                <button
                  onClick={() => handleChangeSegment('original')}
                  className={`px-4 py-2 text-sm tracking-wider transition-all duration-300 ${
                    isOriginal
                      ? 'text-dark border-b-2 border-accent'
                      : 'text-dark/50 hover:text-dark'
                  }`}
                >
                  Signature
                </button>
                <button
                  onClick={() => handleChangeSegment('replicas')}
                  className={`px-4 py-2 text-sm tracking-wider transition-all duration-300 ${
                    isReplicas
                      ? 'text-dark border-b-2 border-accent'
                      : 'text-dark/50 hover:text-dark'
                  }`}
                >
                  Inspired
                </button>
              </div>
            )}

            {/* Cart Icon */}
            {segment && (
              <Link
                href={`/${segment}/carrito`}
                className="text-dark hover:text-primary transition-colors"
              >
                🛒
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-dark hover:text-primary"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {segment && (
              <>
                <Link
                  href={`/${segment}`}
                  className="block text-dark hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catálogo
                </Link>
              </>
            )}

            {segment && (
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-dark">Seleccionar tipo:</p>
                <button
                  onClick={() => handleChangeSegment('original')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    isOriginal
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  100% Original
                </button>
                <button
                  onClick={() => handleChangeSegment('replicas')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    isReplicas
                      ? 'bg-dark text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Réplicas 1.1
                </button>
              </div>
            )}

            {segment && (
              <Link
                href={`/${segment}/carrito`}
                className="block text-dark hover:text-primary border-t border-gray-200 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Carrito
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
