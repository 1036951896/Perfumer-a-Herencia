'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Producto } from '@/types'
import { formatarPrecio, calcularTotal, crearMensajeWhatsApp, generarReferenciaPedido } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export function CarritoCompras({ segment }: { segment: 'original' | 'replicas' }) {
  
  const router = useRouter()
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [referencia, setReferencia] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem(`carrito-${segment}`)
    if (carritoGuardado) {
      setItems(JSON.parse(carritoGuardado))
    }
    setReferencia(generarReferenciaPedido())
  }, [segment])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem(`carrito-${segment}`, JSON.stringify(items))
  }, [items, segment])

  const total = calcularTotal(items.map(i => ({ cantidad: i.cantidad, precio: i.producto.precio || 0 })))

  const handleCantidadChange = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setItems(items.filter(i => i.producto.id !== id))
    } else {
      setItems(items.map(i => 
        i.producto.id === id ? { ...i, cantidad: nuevaCantidad } : i
      ))
    }
  }

  const handleRemover = (id: string) => {
    setItems(items.filter(i => i.producto.id !== id))
  }

  const handleComprar = async () => {
    if (items.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setLoading(true)

    try {
      // Crear pedido en la BD
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productoId: i.producto.id,
            cantidad: i.cantidad,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear pedido')
      }

      const { datos: pedido } = await response.json()

      // Crear mensaje para WhatsApp
      const mensaje = crearMensajeWhatsApp(
        pedido.referencia,
        items.map(i => ({
          nombre: i.producto.nombre,
          cantidad: i.cantidad,
          precio: i.producto.precio || 0,
        })),
        pedido.total
      )

      // Redirigir a WhatsApp
      window.location.href = `https://wa.me/573001234567?text=${mensaje}`

      // Limpiar carrito
      setItems([])
    } catch (error) {
      alert('Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${segment}`}
            className="text-primary hover:text-dark transition-colors mb-4 inline-block"
          >
            ← Volver al catálogo
          </Link>
          <h1 className="text-4xl font-bold text-deep">Mi Carrito</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg text-dark/75 mb-6">Tu carrito está vacío</p>
            <Link
              href={`/${segment}`}
              className="inline-block bg-deep text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {items.map(item => (
                  <div
                    key={item.producto.id}
                    className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <img
                      src={item.producto.imagenUrl}
                      alt={item.producto.nombre}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-1">
                        {item.producto.nombre}
                      </h3>
                      <p className="text-sm text-dark/60 mb-2">
                        {item.producto.marca?.nombre}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        {formatarPrecio(item.producto.precio)}
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleCantidadChange(
                              item.producto.id,
                              item.cantidad - 1
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleCantidadChange(
                              item.producto.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="1"
                        />
                        <button
                          onClick={() =>
                            handleCantidadChange(
                              item.producto.id,
                              item.cantidad + 1
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          +
                        </button>

                        <button
                          onClick={() => handleRemover(item.producto.id)}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-dark/60 mb-2">Subtotal</p>
                      <p className="text-xl font-bold text-deep">
                        {formatarPrecio(
                          (item.producto.precio || 0) * item.cantidad
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 space-y-6">
                <div>
                  <p className="text-sm text-dark/60 mb-1">Referencia de pedido</p>
                  <p className="font-mono text-sm font-bold text-deep">
                    {referencia}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between mb-4">
                    <p className="text-dark/75">Subtotal</p>
                    <p className="font-medium text-dark">
                      {formatarPrecio(total)}
                    </p>
                  </div>

                  <div className="flex justify-between mb-4">
                    <p className="text-dark/75">Envío</p>
                    <p className="font-medium text-dark">Coordinar</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="font-bold text-deep">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatarPrecio(total)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleComprar}
                  disabled={loading || items.length === 0}
                  className="w-full bg-deep text-white py-3 rounded-lg font-bold hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Comprar por WhatsApp'}
                </button>

                <p className="text-xs text-dark/50 text-center">
                  Serás redirigido a WhatsApp para completar tu pedido
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
