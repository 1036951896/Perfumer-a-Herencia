'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Producto } from '@/types'
import { formatarPrecio } from '@/lib/utils'

interface ProductoDetalleProps {
  productoId: string
  segment: 'original' | 'replicas'
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f5f5f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='24' fill='%23999'%3EPerfume%3C/text%3E%3C/svg%3E"

export function ProductoDetalle({
  productoId,
  segment,
}: ProductoDetalleProps) {
  const router = useRouter()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agregado, setAgregado] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMG)

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`/api/productos/${productoId}`)
        if (!response.ok) throw new Error('Producto no encontrado')
        const data = await response.json()
        setProducto(data.datos)
        setImgSrc(data.datos?.imagenUrl || FALLBACK_IMG)
      } catch (error) {
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    cargarProducto()
  }, [productoId])

  const handleAgregarCarrito = () => {
    if (!producto) return

    // Limpiar claves viejas y leer carrito con protección
    localStorage.removeItem('carrito-original')
    localStorage.removeItem('carrito-replicas')

    let carrito: any[] = []
    try {
      const raw = localStorage.getItem('carrito')
      const parsed = raw ? JSON.parse(raw) : []
      carrito = Array.isArray(parsed)
        ? parsed.filter((i: any) => i && i.producto && i.producto.id)
        : []
    } catch {
      carrito = []
    }

    const existente = carrito.find(
      (i: any) => i.producto.id === producto.id
    )

    if (existente) {
      existente.cantidad += cantidad
    } else {
      carrito.push({ producto, cantidad })
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-dark/50">Cargando producto...</p>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-dark/75 mb-4">{error || 'Producto no encontrado'}</p>
        <Link
          href={`/${segment}`}
          className="text-primary hover:text-dark transition-colors"
        >
          ← Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Link atrás */}
        <Link
          href={`/${segment}`}
          className="text-primary hover:text-dark transition-colors mb-8 inline-block"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative w-full aspect-square">
              <Image
                src={imgSrc}
                alt={producto.nombre}
                fill
                unoptimized
                className="object-cover"
                priority
                onError={() => setImgSrc(FALLBACK_IMG)}
              />
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Marca */}
            <p className="text-sm text-dark/50 uppercase tracking-wide">
              {producto.marca?.nombre}
            </p>

            {/* Nombre */}
            <h1 className="text-4xl font-bold text-deep">{producto.nombre}</h1>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span
                className={`inline-block px-3 py-1 rounded text-white text-sm font-bold ${
                  producto.segmento === 'ORIGINAL'
                    ? 'bg-primary'
                    : 'bg-dark'
                }`}
              >
                {producto.segmento === 'ORIGINAL'
                  ? '100% Original'
                  : 'Réplica'}
              </span>
              <span className="inline-block px-3 py-1 rounded bg-gray-200 text-dark text-sm">
                {producto.genero === 'MASCULINO'
                  ? '♂️ Masculino'
                  : producto.genero === 'FEMENINO'
                  ? '♀️ Femenino'
                  : '⚥ Unisex'}
              </span>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-dark/75 text-lg leading-relaxed">
                {producto.descripcion}
              </p>
            )}

            {/* Precio */}
            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-5xl font-bold text-primary">
                {formatarPrecio(producto.precio)}
              </p>
            </div>

            {/* Cantidad y carrito */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-dark font-medium">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() =>
                      setCantidad(Math.max(1, cantidad - 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) =>
                      setCantidad(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-16 text-center py-2 border-x border-gray-300 outline-none"
                  />
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAgregarCarrito}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  agregado
                    ? 'bg-green-500 text-white'
                    : 'bg-deep text-white hover:bg-primary'
                }`}
              >
                {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
              </button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/573117997246?text=${encodeURIComponent(
                  `Hola, me interesa este producto: *${producto.nombre}* (${formatarPrecio(producto.precio)}). ¿Está disponible?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-lg font-bold text-lg bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>

              {agregado && (
                <Link
                  href={`/${segment}/carrito`}
                  className="block text-center py-2 border-2 border-deep text-deep rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Ir al carrito
                </Link>
              )}
            </div>

            {/* Info adicional */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm text-dark/75">
              <p>✓ Envío disponible en toda Colombia</p>
              <p>✓ Pago seguro por WhatsApp</p>
              <p>✓ Garantía de satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
