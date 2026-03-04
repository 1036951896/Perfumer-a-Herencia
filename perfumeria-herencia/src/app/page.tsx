'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Gateway() {
  const router = useRouter()

  useEffect(() => {
    // No auto-redirigir: siempre mostrar el gateway para que el usuario elija
  }, [router])

  const handleSelect = (segment: 'original' | 'replicas') => {
    localStorage.setItem('segment', segment)
    router.push(`/${segment}`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        {/* Logo */}
        <div className="mb-16 animate-fade-in">
          <Image 
            src="/logo_minimalista.png"
            alt="Herencia Perfumería"
            width={180}
            height={180}
            className="mx-auto opacity-95 logo-soft-shadow"
            priority
          />
          <div className="w-12 h-[1px] bg-accent mx-auto mt-10 opacity-50"></div>
        </div>

        <p
          className="text-sm uppercase tracking-widest-2xl text-dark/50 mb-16 animate-fade-in"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          Perfumería de Autor
        </p>

        {/* Statement */}
        <p
          className="text-lg leading-relaxed text-dark/60 mb-20 max-w-xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}
        >
          Cada fragancia es una declaración silenciosa.<br />
          Descubre la colección que conecta contigo.
        </p>

        {/* Collections */}
        <div
          className="grid md:grid-cols-2 gap-16 animate-slide-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
        >

          <div 
            onClick={() => handleSelect('original')}
            className="group cursor-pointer border-t border-dark/20 pt-8 
                       transition-all duration-500 hover:opacity-60"
          >
            <h2 className="text-3xl font-serif font-light mb-4 group-hover:tracking-wider transition-all duration-500">
              Colección Signature
            </h2>
            <p className="opacity-60 text-sm leading-relaxed">
              Fragancias originales certificadas.
            </p>
          </div>

          <div 
            onClick={() => handleSelect('replicas')}
            className="group cursor-pointer border-t border-dark/20 pt-8 
                       transition-all duration-500 hover:opacity-60"
          >
            <h2 className="text-3xl font-serif font-light mb-4 group-hover:tracking-wider transition-all duration-500">
              Colección Inspired
            </h2>
            <p className="opacity-60 text-sm leading-relaxed">
              Interpretaciones de alta calidad.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
