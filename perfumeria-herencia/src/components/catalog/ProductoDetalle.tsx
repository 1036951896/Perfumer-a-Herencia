'use client'

import { useState, useEffect, useRef } from 'react'
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

/** Deriva la URL de la imagen 2 a partir de la imagen 1 */
function getImg2(img1: string): string | null {
  if (!img1 || img1.startsWith('data:')) return null
  if (img1.includes('.1.avif')) return img1.replace('.1.avif', '.2.avif')
  if (img1.match(/1\.avif$/)) return img1.replace(/1\.avif$/, '2.avif')
  return null
}

/** Lee la lista de IDs del catálogo y calcula el prev/next */
function getNavIds(productoId: string): { prevId: string | null; nextId: string | null; pos: number; total: number } {
  try {
    const raw = sessionStorage.getItem('herencia_lista_ids')
    if (!raw) return { prevId: null, nextId: null, pos: 0, total: 0 }
    const ids: string[] = JSON.parse(raw)
    const idx = ids.indexOf(productoId)
    if (idx === -1) return { prevId: null, nextId: null, pos: 0, total: ids.length }
    return {
      prevId: idx > 0 ? ids[idx - 1] : null,
      nextId: idx < ids.length - 1 ? ids[idx + 1] : null,
      pos: idx + 1,
      total: ids.length,
    }
  } catch {
    return { prevId: null, nextId: null, pos: 0, total: 0 }
  }
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
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMG)
  const [imagenes, setImagenes] = useState<string[]>([FALLBACK_IMG])
  const [imgActiva, setImgActiva] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Navegación entre productos
  const [nav, setNav] = useState<{ prevId: string | null; nextId: string | null; pos: number; total: number }>({
    prevId: null, nextId: null, pos: 0, total: 0,
  })

  useEffect(() => {
    setNav(getNavIds(productoId))
  }, [productoId])

  const irProducto = (id: string) => router.push(`/${segment}/producto/${id}`)

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`/api/productos/${productoId}`)
        if (!response.ok) throw new Error('Producto no encontrado')
        const data = await response.json()
        setProducto(data.datos)
        const imgRaw: string = data.datos?.imagenUrl || FALLBACK_IMG
        // Soporte pipe-separated: "url1|url2"
        if (imgRaw.includes('|')) {
          const imgs = imgRaw.split('|').map((u: string) => u.trim()).filter(Boolean)
          setImagenes(imgs)
          setImgSrc(imgs[0])
        } else {
          const img2 = getImg2(imgRaw)
          setImagenes(img2 ? [imgRaw, img2] : [imgRaw])
          setImgSrc(imgRaw)
        }
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
    localStorage.removeItem('carrito-original')
    localStorage.removeItem('carrito-replicas')
    let carrito: any[] = []
    try {
      const raw = localStorage.getItem('carrito')
      const parsed = raw ? JSON.parse(raw) : []
      carrito = Array.isArray(parsed)
        ? parsed.filter((i: any) => i && i.producto && i.producto.id)
        : []
    } catch { carrito = [] }
    const existente = carrito.find((i: any) => i.producto.id === producto.id)
    if (existente) { existente.cantidad += cantidad } else { carrito.push({ producto, cantidad }) }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  const irA = (idx: number) => setImgActiva(Math.max(0, Math.min(imagenes.length - 1, idx)))

  // Touch para carrusel de IMÁGENES (área de la foto)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) irA(imgActiva + (diff > 0 ? 1 : -1))
    touchStartX.current = null
  }

  // Touch para navegación entre PRODUCTOS (barra inferior)
  const onNavTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onNavTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    // Solo activar si el swipe es claramente horizontal
    if (Math.abs(dx) > 60 && dy < 40) {
      if (dx > 0 && nav.nextId) irProducto(nav.nextId)
      if (dx < 0 && nav.prevId) irProducto(nav.prevId)
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-dark/50">Cargando producto...</p>
    </div>
  )

  if (error || !producto) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <p className="text-dark/75 mb-4">{error || 'Producto no encontrado'}</p>
      <Link href={`/${segment}`} className="text-primary hover:text-dark transition-colors">← Volver al catálogo</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Link atrás */}
        <Link
          href={`/${segment}`}
          className="text-[10px] tracking-[0.28em] uppercase text-dark/35 hover:text-dark transition-colors mb-12 inline-block"
        >
          ← Catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Carrusel de imágenes */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* Contenedor deslizable */}
            <div
              className="relative w-full aspect-square select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {imagenes.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    idx === imgActiva ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${producto.nombre} - imagen ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-contain"
                    priority={idx === 0}
                    onError={() => {
                      const copia = [...imagenes]
                      copia[idx] = FALLBACK_IMG
                      setImagenes(copia)
                    }}
                  />
                </div>
              ))}

              {/* Flechas — solo si hay 2 imágenes */}
              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => irA(imgActiva - 1)}
                    disabled={imgActiva === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow transition-all disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => irA(imgActiva + 1)}
                    disabled={imgActiva === imagenes.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow transition-all disabled:opacity-30"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Bolitas indicadoras */}
            {imagenes.length > 1 && (
              <div className="flex justify-center gap-2 py-3">
                {imagenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => irA(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === imgActiva
                        ? 'w-4 h-2 bg-dark'
                        : 'w-2 h-2 bg-dark/25 hover:bg-dark/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="space-y-8">
            {/* Marca */}
            <p className="text-[10px] tracking-[0.3em] uppercase text-dark/40">
              {producto.marca?.nombre}
            </p>

            {/* Nombre */}
            <h1 className="font-serif text-4xl font-light leading-tight text-dark">{producto.nombre}</h1>

            {/* Separador dorado */}
            <div className="w-12 h-[1px] bg-accent" />

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-dark/60 text-base leading-relaxed">
                {producto.descripcion}
              </p>
            )}

            {/* Badge segmento */}
            <div className="flex gap-3 flex-wrap">
              <span className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border ${
                producto.segmento === 'ORIGINAL'
                  ? 'border-accent text-accent'
                  : 'border-dark/30 text-dark/60'
              }`}>
                {producto.segmento === 'ORIGINAL' ? '100% Original' : 'Inspirada'}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-dark/20 text-dark/50">
                {producto.genero === 'MASCULINO' ? 'Masculino' : producto.genero === 'FEMENINO' ? 'Femenino' : 'Unisex'}
              </span>
            </div>

            {/* Precio */}
            <div className="py-6 border-t border-b border-dark/8">
              <p className="font-serif text-4xl font-light text-dark">
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
                className={`w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  agregado
                    ? 'bg-green-700 text-white'
                    : 'bg-[#1e293b] text-white hover:bg-accent'
                }`}
              >
                {agregado ? '✓ Agregado' : 'Agregar al carrito'}
              </button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/573117997246?text=${encodeURIComponent(
                  `Hola, me interesa: *${producto.nombre}* (${formatarPrecio(producto.precio)}). ¿Está disponible?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 border border-dark/20 text-dark/70 text-sm tracking-[0.15em] uppercase hover:border-dark/60 hover:text-dark transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>

              {agregado && (
                <Link
                  href={`/${segment}/carrito`}
                  className="block text-center py-3 border border-dark/20 text-dark/60 text-xs tracking-[0.2em] uppercase hover:border-dark/50 hover:text-dark transition-all"
                >
                  Ver carrito
                </Link>
              )}
            </div>

            {/* Microconfianza */}
            <ul className="text-[11px] text-dark/40 space-y-2 tracking-wide">
              <li>✔&nbsp; {producto.segmento === 'ORIGINAL' ? 'Producto 100% original certificado' : 'Inspiración fiel a la fragancia original'}</li>
              <li>✔&nbsp; Envíos a todo Colombia</li>
              <li>✔&nbsp; Pago seguro y asesoría personalizada</li>
            </ul>
          </div>
        </div>

        {/* Navegación entre productos */}
        {nav.total > 0 && (
          <div
            className="mt-16 border-t border-dark/8 pt-6 flex items-center justify-between select-none"
            onTouchStart={onNavTouchStart}
            onTouchEnd={onNavTouchEnd}
          >
            {/* Anterior */}
            <button
              onClick={() => nav.prevId && irProducto(nav.prevId)}
              disabled={!nav.prevId}
              className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-dark/40 hover:text-dark transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span className="text-xl leading-none">‹</span>
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Posición */}
            <span className="text-[10px] tracking-[0.25em] uppercase text-dark/25">
              {nav.pos} / {nav.total}
            </span>

            {/* Siguiente */}
            <button
              onClick={() => nav.nextId && irProducto(nav.nextId)}
              disabled={!nav.nextId}
              className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-dark/40 hover:text-dark transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="text-xl leading-none">›</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
