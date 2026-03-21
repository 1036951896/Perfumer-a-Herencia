'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Segment } from '@/types'
import { esSegmentoValido } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const [segment, setSegment] = useState<Segment | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categorias, setCategorias] = useState<Array<{ id: string; nombre: string }>>([])

  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : (data.datos || [])
        setCategorias(all.filter((c: any) => (c._count?.productos ?? 1) > 0))
      })
      .catch(() => {})
  }, [])

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

  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  useEffect(() => {
    if (!segment) return
    const actualizarContador = () => {
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]')
      const total = carrito.reduce((acc: number, i: any) => acc + (i.cantidad || 1), 0)
      setCantidadCarrito(total)
    }
    actualizarContador()
    window.addEventListener('storage', actualizarContador)
    // Polling cada segundo para detectar cambios del mismo tab
    const interval = setInterval(actualizarContador, 1000)
    return () => {
      window.removeEventListener('storage', actualizarContador)
      clearInterval(interval)
    }
  }, [segment])

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-dark/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo_minimalista.png"
              alt="Herencia"
              width={110}
              height={110}
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

            {/* Categorías */}
            {categorias.length > 0 && (
              <div className="hidden md:flex items-center gap-5">
                {categorias.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                    className="text-xs tracking-[0.15em] uppercase text-dark/60 hover:text-dark transition-colors"
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            )}

            {/* Segment Switcher */}
            {segment && (
              <div className="flex items-center gap-2 border-l border-dark/10 pl-6">
                <button
                  onClick={() => handleChangeSegment('original')}
                  className={`px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 relative ${
                    isOriginal
                      ? 'text-dark after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-accent'
                      : 'text-dark/40 hover:text-dark'
                  }`}
                >
                  Signature
                </button>
                <button
                  onClick={() => handleChangeSegment('replicas')}
                  className={`px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 relative ${
                    isReplicas
                      ? 'text-dark after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-accent'
                      : 'text-dark/40 hover:text-dark'
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
                className="relative text-dark hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cantidadCarrito > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cantidadCarrito > 99 ? '99+' : cantidadCarrito}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile: carrito + hamburguesa */}
          <div className="flex items-center gap-4 md:hidden">
            {segment && (
              <Link
                href={`/${segment}/carrito`}
                className="relative text-dark hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cantidadCarrito > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cantidadCarrito > 99 ? '99+' : cantidadCarrito}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark hover:text-primary"
            >
              ☰
            </button>
          </div>
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

            {/* Categorías mobile */}
            {categorias.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-xs tracking-widest uppercase text-dark/40">Categorías</p>
                {categorias.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                    className="block text-sm text-dark/70 hover:text-dark"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
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
                className="flex items-center gap-2 text-dark hover:text-primary border-t border-gray-200 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Carrito
                {cantidadCarrito > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cantidadCarrito}
                  </span>
                )}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
