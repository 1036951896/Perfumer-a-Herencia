'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Producto } from '@/types'
import { formatarPrecio } from '@/lib/utils'

export interface ProductCardProps {
  producto: Producto
  segment: 'original' | 'replicas'
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f8f5f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='22' fill='%23bbb'%3EHerencia%3C/text%3E%3C/svg%3E"

export function ProductCard({ producto, segment }: ProductCardProps) {
  // Soporte pipe-separated: "url1|url2" — usar solo la primera para la card
  const coverUrl = producto.imagenUrl?.includes('|')
    ? producto.imagenUrl.split('|')[0].trim()
    : producto.imagenUrl
  const [imgSrc, setImgSrc] = useState(coverUrl)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Link href={`/${segment}/producto/${producto.id}`} className="group block">
        {/* Imagen */}
        <div className="aspect-square bg-white flex items-center justify-center overflow-hidden p-8">
          <div className="relative w-full h-full">
            <Image
              src={imgSrc || FALLBACK_IMG}
              alt={producto.nombre}
              fill
              unoptimized
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgSrc(FALLBACK_IMG)}
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="text-center mt-6 space-y-2 px-2">
          {/* Marca */}
          <p className="text-[10px] tracking-[0.28em] uppercase text-dark/40">
            {producto.marca?.nombre || 'Herencia'}
          </p>

          {/* Nombre */}
          <h3 className="font-serif text-lg leading-snug text-dark transition-opacity duration-300 group-hover:opacity-60">
            {producto.nombre}
          </h3>

          {/* Género */}
          <p className="text-[11px] text-dark/35">
            {producto.genero === 'MASCULINO'
              ? 'Masculino'
              : producto.genero === 'FEMENINO'
              ? 'Femenino'
              : 'Unisex'}
          </p>

          {/* Precio */}
          <p className="text-sm text-dark/70 pt-1">
            {formatarPrecio(producto.precio)}
          </p>

          {/* CTA */}
          <span className="inline-block text-[10px] tracking-[0.22em] uppercase text-dark/40 pt-1 border-b border-dark/20 pb-0.5 transition-all duration-300 group-hover:text-dark group-hover:border-dark">
            Explorar →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
