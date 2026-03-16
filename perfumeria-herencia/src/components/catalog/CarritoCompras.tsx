'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Producto } from '@/types'
import { formatarPrecio, calcularTotal, crearMensajeWhatsApp, generarReferenciaPedido } from '@/lib/utils'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

interface ConfigPasarela {
  proveedor: string
  activo: boolean
  nombreVisible?: string
}

export function CarritoCompras({ segment }: { segment: 'original' | 'replicas' }) {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [referencia] = useState(() => generarReferenciaPedido())
  const [procesando, setProcesando] = useState<string | null>(null)
  const [pasarelas, setPasarelas] = useState<ConfigPasarela[]>([])

  // Cargar carrito + refrescar imágenes desde API
  useEffect(() => {
    localStorage.removeItem('carrito-original')
    localStorage.removeItem('carrito-replicas')

    let validos: ItemCarrito[] = []
    try {
      const raw = localStorage.getItem('carrito')
      if (raw) {
        const parsed = JSON.parse(raw)
        validos = Array.isArray(parsed)
          ? parsed.filter((i: any) => i?.producto?.id && typeof i.cantidad === 'number')
          : []
        setItems(validos)
      }
    } catch {
      localStorage.removeItem('carrito')
    }

    if (validos.length > 0) {
      Promise.all(
        validos.map((i: ItemCarrito) =>
          fetch(`/api/productos/${i.producto.id}`).then(r => r.ok ? r.json() : null).catch(() => null)
        )
      ).then(resultados => {
        const actualizados = validos.map((item: ItemCarrito, idx: number) => {
          const fresco = resultados[idx]?.datos || resultados[idx]
          return fresco?.id ? { ...item, producto: fresco } : item
        })
        setItems(actualizados)
        localStorage.setItem('carrito', JSON.stringify(actualizados))
      })
    }
  }, [segment])

  // Cargar config de pasarelas
  useEffect(() => {
    fetch('/api/config/pasarela')
      .then(r => r.json())
      .then(({ datos }) => {
        if (Array.isArray(datos)) setPasarelas(datos)
      })
      .catch(() => {})
  }, [])

  const total = calcularTotal(items.filter(i => i?.producto).map(i => ({ cantidad: i.cantidad, precio: i.producto.precio || 0 })))

  const actualizarCarrito = (nuevosItems: ItemCarrito[]) => {
    setItems(nuevosItems)
    localStorage.setItem('carrito', JSON.stringify(nuevosItems))
  }

  const handleCantidadChange = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      actualizarCarrito(items.filter(i => i.producto.id !== id))
    } else {
      actualizarCarrito(items.map(i => i.producto.id === id ? { ...i, cantidad: nuevaCantidad } : i))
    }
  }

  const handleRemover = (id: string) => {
    actualizarCarrito(items.filter(i => i.producto.id !== id))
  }

  const crearPedidoDB = async () => {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad })),
      }),
    })
    if (!res.ok) throw new Error('Error al crear pedido')
    return (await res.json()).datos
  }

  const handleWhatsApp = async () => {
    if (items.length === 0) return
    setProcesando('whatsapp')
    try {
      const pedido = await crearPedidoDB()
      const mensaje = crearMensajeWhatsApp(
        pedido.referencia,
        items.map(i => ({ nombre: i.producto.nombre, cantidad: i.cantidad, precio: i.producto.precio || 0 })),
        pedido.total
      )
      actualizarCarrito([])
      window.location.href = `https://wa.me/573117997246?text=${mensaje}`
    } catch {
      alert('Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setProcesando(null)
    }
  }

  const handleMercadoPago = async () => {
    if (items.length === 0) return
    setProcesando('mercadopago')
    try {
      const res = await fetch('/api/pagos/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, referencia }),
      })
      if (!res.ok) throw new Error('Error MP')
      const { initPoint } = await res.json()
      actualizarCarrito([])
      window.location.href = initPoint
    } catch {
      alert('Error al conectar con Mercado Pago.')
    } finally {
      setProcesando(null)
    }
  }

  const handleAddi = async () => {
    if (items.length === 0) return
    setProcesando('addi')
    try {
      const res = await fetch('/api/pagos/addi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, referencia }),
      })
      if (!res.ok) throw new Error('Error Addi')
      const { checkoutUrl } = await res.json()
      actualizarCarrito([])
      window.location.href = checkoutUrl
    } catch {
      alert('Error al conectar con Addi.')
    } finally {
      setProcesando(null)
    }
  }

  const mpConfig = pasarelas.find(p => p.proveedor === 'mercadopago')
  const addiConfig = pasarelas.find(p => p.proveedor === 'addi')
  const mpActivo = false // deshabilitado temporalmente
  const addiActivo = false // deshabilitado temporalmente

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="mb-14">
          <Link
            href={`/${segment}`}
            className="text-[9px] tracking-[0.35em] uppercase text-dark/35 hover:text-dark transition-colors duration-200 inline-block mb-10"
          >
            ← Catálogo
          </Link>
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-2">Tu selección</p>
          <h1 className="font-serif text-3xl font-light text-dark">Mi Carrito</h1>
          <div className="w-14 h-[2px] bg-accent mt-4" />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/40 text-sm mb-8 tracking-wide">Tu carrito está vacío</p>
            <Link
              href={`/${segment}`}
              className="text-[9px] tracking-[0.35em] uppercase text-dark/50 hover:text-dark transition-colors border-b border-dark/20"
            >
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-0">

            {/* Lista de productos */}
            {items.map((item) => (
              <div
                key={item.producto.id}
                className="grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr] gap-8 py-10 border-b border-dark/[0.07] last:border-b-0 items-start"
              >
                {/* Imagen — protagonista */}
                <div className="w-[160px] h-[160px] bg-[#f8f8f8] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={item.producto.imagenUrl?.includes('|') ? item.producto.imagenUrl.split('|')[0].trim() : (item.producto.imagenUrl || '')}
                    alt={item.producto.nombre}
                    className="w-[140px] h-[140px] object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4 pt-2">
                  <div>
                    <h3
                      className="text-sm font-medium text-dark leading-snug"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {item.producto.nombre}
                    </h3>
                    <p className="text-[11px] tracking-widest uppercase text-dark/35 mt-1.5">
                      {item.producto.marca?.nombre}
                    </p>
                    <p className="text-dark mt-4" style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '0.02em' }}>
                      {formatarPrecio(item.producto.precio)}
                    </p>
                  </div>

                  {/* Cantidad */}
                  <div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-dark/30 mb-2">Cantidad</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCantidadChange(item.producto.id, item.cantidad - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-dark/15 text-dark/50 hover:border-dark/40 hover:text-dark transition-all text-base rounded-sm"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-dark w-5 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => handleCantidadChange(item.producto.id, item.cantidad + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-dark/15 text-dark/50 hover:border-dark/40 hover:text-dark transition-all text-base rounded-sm"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemover(item.producto.id)}
                    className="text-[9px] tracking-[0.3em] uppercase text-dark/25 hover:text-dark/55 transition-colors duration-200 text-left w-fit"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Resumen */}
            <div className="pt-10 space-y-4">
              <p className="text-[9px] tracking-[0.45em] uppercase text-dark/30 pb-2">Resumen de compra</p>
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-widest uppercase text-dark/40">Subtotal</span>
                <span className="text-sm font-light text-dark">{formatarPrecio(total)}</span>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-dark/[0.07]">
                <span className="text-[11px] tracking-widest uppercase text-dark/40">Envío</span>
                <span className="text-sm font-light text-dark/50">Coordinar</span>
              </div>

              {/* Total destacado */}
              <div className="pt-6 pb-10">
                <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-2">Total</p>
                <p className="font-serif text-4xl font-light text-dark">{formatarPrecio(total)}</p>
              </div>

              {/* ── Métodos de pago ───────────────────── */}
              <div>
                <p className="text-[9px] tracking-[0.45em] uppercase text-dark/30 mb-4">Método de pago</p>
                <div className="space-y-3">

                  {/* Mercado Pago */}
                  <button
                    onClick={handleMercadoPago}
                    disabled={!mpActivo || procesando !== null}
                    className="w-full flex items-center gap-4 border rounded-[10px] px-5 py-4 transition-all duration-200 group text-left disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: mpActivo ? '#fff' : '#fafafa', borderColor: 'rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => { if (mpActivo) e.currentTarget.style.borderColor = '#009EE3' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: '#009EE3' }}>
                      MP
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-dark">Mercado Pago</p>
                      <p className="text-xs text-dark/40 mt-0.5">
                        {mpActivo ? 'Tarjeta, PSE, Nequi, efectivo' : 'Próximamente disponible'}
                      </p>
                    </div>
                    {procesando === 'mercadopago'
                      ? <span className="text-xs text-dark/40 animate-pulse">Redirigiendo…</span>
                      : <span className="text-dark/20 text-lg">→</span>
                    }
                  </button>

                  {/* Addi */}
                  <button
                    onClick={handleAddi}
                    disabled={!addiActivo || procesando !== null}
                    className="w-full flex items-center gap-4 border rounded-[10px] px-5 py-4 transition-all duration-200 group text-left disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: addiActivo ? '#fff' : '#fafafa', borderColor: 'rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => { if (addiActivo) e.currentTarget.style.borderColor = '#FF4E00' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: '#FF4E00' }}>
                      Ad
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-dark">Addi — Paga a cuotas</p>
                      <p className="text-xs text-dark/40 mt-0.5">
                        {addiActivo ? 'Sin interés · Aprobación inmediata' : 'Próximamente disponible'}
                      </p>
                    </div>
                    {procesando === 'addi'
                      ? <span className="text-xs text-dark/40 animate-pulse">Redirigiendo…</span>
                      : <span className="text-dark/20 text-lg">→</span>
                    }
                  </button>

                  {/* WhatsApp — siempre activo */}
                  <button
                    onClick={handleWhatsApp}
                    disabled={procesando !== null}
                    className="w-full flex items-center gap-4 bg-white border rounded-[10px] px-5 py-4 transition-all duration-200 group text-left disabled:opacity-50"
                    style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#25D366' }}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-dark">Continuar por WhatsApp</p>
                      <p className="text-xs text-dark/40 mt-0.5">Coordinamos pago y envío contigo</p>
                    </div>
                    {procesando === 'whatsapp'
                      ? <span className="text-xs text-dark/40 animate-pulse">Abriendo…</span>
                      : <span className="text-dark/20 text-lg">→</span>
                    }
                  </button>

                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-dark/20 fill-current"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                <span className="text-[9px] tracking-[0.3em] uppercase text-dark/25">Tus datos están protegidos · Transacciones seguras</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
