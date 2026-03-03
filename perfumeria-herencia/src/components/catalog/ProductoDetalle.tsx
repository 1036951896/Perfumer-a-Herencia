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

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`/api/productos/${productoId}`)
        if (!response.ok) throw new Error('Producto no encontrado')
        const data = await response.json()
        setProducto(data.datos)
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

    const carrito = JSON.parse(
      localStorage.getItem(`carrito-${segment}`) || '[]'
    )
    const existente = carrito.find(
      (i: any) => i.producto.id === producto.id
    )

    if (existente) {
      existente.cantidad += cantidad
    } else {
      carrito.push({ producto, cantidad })
    }

    localStorage.setItem(`carrito-${segment}`, JSON.stringify(carrito))
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
                src={producto.imagenUrl}
                alt={producto.nombre}
                fill
                className="object-cover"
                priority
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
                  producto.tipo === 'ORIGINAL'
                    ? 'bg-primary'
                    : 'bg-dark'
                }`}
              >
                {producto.tipo === 'ORIGINAL'
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
