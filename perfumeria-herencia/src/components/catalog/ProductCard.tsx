'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Producto } from '@/types'
import { formatarPrecio } from '@/lib/utils'

export interface ProductCardProps {
  producto: Producto
  segment: 'original' | 'replicas'
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f5f5f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='24' fill='%23999'%3EPerfume%3C/text%3E%3C/svg%3E"

export function ProductCard({ producto, segment }: ProductCardProps) {
  // Soporte pipe-separated: "url1|url2" — usar solo la primera para la card
  const coverUrl = producto.imagenUrl?.includes('|')
    ? producto.imagenUrl.split('|')[0].trim()
    : producto.imagenUrl
  const [imgSrc, setImgSrc] = useState(coverUrl)

  return (
    <Link href={`/${segment}/producto/${producto.id}`} className="group block">
      <div className="cursor-pointer">
        {/* Imagen */}
        <div className="relative w-full aspect-square overflow-hidden mb-6">
          <Image
            src={imgSrc}
            alt={producto.nombre}
            fill
            unoptimized
            className="object-contain transition-opacity duration-500 group-hover:opacity-80"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(FALLBACK_IMG)}
          />
        </div>

        {/* Contenido */}
        <div className="text-center">
          {/* Marca */}
          <p className="text-xs tracking-widest uppercase text-dark/40 mb-3">
            {producto.marca?.nombre || 'Sin marca'}
          </p>

          {/* Nombre */}
          <h3 className="font-serif text-xl tracking-wide text-dark mb-3 transition-opacity duration-300 group-hover:opacity-70">
            {producto.nombre}
          </h3>

          {/* Género */}
          <p className="text-xs text-dark/50 mb-4">
            {producto.genero === 'MASCULINO'
              ? 'Masculino'
              : producto.genero === 'FEMENINO'
              ? 'Femenino'
              : 'Unisex'}
          </p>

          {/* Precio */}
          <p className="text-sm text-dark/70 mb-6">
            {formatarPrecio(producto.precio)}
          </p>

          {/* CTA Micro */}
          <span className="inline-block text-xs tracking-widest uppercase border-b border-dark pb-1 transition-opacity duration-300 group-hover:opacity-60">
            Descubrir →
          </span>
        </div>
      </div>
    </Link>
  )
}
