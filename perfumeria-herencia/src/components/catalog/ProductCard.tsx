'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Producto } from '@/types'
import { formatarPrecio } from '@/lib/utils'

export interface ProductCardProps {
  producto: Producto
  segment: 'original' | 'replicas'
}

export function ProductCard({ producto, segment }: ProductCardProps) {
  return (
    <Link href={`/${segment}/producto/${producto.id}`} className="group block">
      <div className="cursor-pointer">
        {/* Imagen */}
        <div className="relative w-full aspect-square overflow-hidden mb-6">
          <Image
            src={producto.imagenUrl}
            alt={producto.nombre}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-80"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
