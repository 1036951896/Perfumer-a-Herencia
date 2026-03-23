'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Coleccion, Producto } from '@/types'
import { formatarPrecio } from '@/lib/utils'

interface Props {
  segment: 'original' | 'replicas'
}

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect width='400' height='500' fill='%23f5f4f0'/%3E%3C/svg%3E"
const CARD_WIDTH = 240 // w-52 (208px) + gap (32px)
const AUTOPLAY_MS = 2800

export function CarruselSeleccionCurada({ segment }: Props) {
  const segType = segment === 'original' ? 'ORIGINAL' : 'REPLICA'

  const [colecciones, setColecciones] = useState<Coleccion[]>([])
  const [tabActivo, setTabActivo] = useState(0)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [paused, setPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const tabActivoRef = useRef(0)
  const coleccionesLenRef = useRef(0)

  // Drag / swipe con mouse
  const dragRef = useRef({ dragging: false, startX: 0, scrollStart: 0, moved: false })

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    dragRef.current = { dragging: true, startX: e.clientX, scrollStart: el.scrollLeft, moved: false }
    el.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    const d = dragRef.current
    if (!d.dragging) return
    const el = scrollRef.current
    if (!el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    el.scrollLeft = d.scrollStart - dx
  }
  const onMouseUp = () => {
    const el = scrollRef.current
    if (el) el.style.cursor = 'grab'
    dragRef.current.dragging = false
  }

  // Sincronizar refs para que tick pueda leerlos sin deps
  useEffect(() => { tabActivoRef.current = tabActivo }, [tabActivo])
  useEffect(() => { coleccionesLenRef.current = colecciones.length }, [colecciones])

  // Cargar colecciones destacadas
  useEffect(() => {
    fetch(`/api/colecciones?segmento=${segType}`)
      .then(r => r.json())
      .then(d => {
        const destacadas: Coleccion[] = (d.datos || []).filter((c: Coleccion) => c.destacado)
        setColecciones(destacadas)
        setTabActivo(0)
      })
      .catch(() => {})
  }, [segType])

  // Cargar productos de la colección activa
  useEffect(() => {
    if (!colecciones.length) return
    const col = colecciones[tabActivo]
    setLoading(true)
    setProductos([])
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
    fetch(`/api/productos?coleccionSlug=${col.slug}&limite=20&segmento=${segType}`)
      .then(r => r.json())
      .then(d => setProductos(d.datos || []))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [colecciones, tabActivo, segType])

  // Autoplay
  const tick = useCallback(() => {
    const el = scrollRef.current
    if (!el || paused) return
    const nearEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8
    if (nearEnd) {
      // Al final → pasar a la siguiente colección (o volver a la primera)
      const siguiente = (tabActivoRef.current + 1) % coleccionesLenRef.current
      setTabActivo(siguiente)
    } else {
      el.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' })
    }
  }, [paused])

  useEffect(() => {
    if (loading || productos.length === 0) return
    autoplayRef.current = setInterval(tick, AUTOPLAY_MS)
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [tick, loading, productos])

  if (!colecciones.length) return null

  const col = colecciones[tabActivo]

  return (
    <section className="mb-20 mt-2">

      {/* ── Encabezado ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: col.colorTexto ? `${col.colorTexto}` : '#8a7a6a' }} >
            Selección curada
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-light leading-snug" style={{ color: col.colorTexto || undefined }}>
            {col.nombre}
          </h2>
          {/* Línea dorada */}
          <div className="w-14 h-[2px] bg-accent mt-3" />
        </div>

        {/* Tabs cuando hay varias colecciones destacadas */}
        {colecciones.length > 1 && (
          <div className="flex gap-1 flex-wrap">
            {colecciones.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setTabActivo(i)}
                className={`text-[9px] tracking-[0.22em] uppercase px-3 py-1.5 border-b transition-all duration-200 ${
                  i === tabActivo
                    ? 'border-dark text-dark'
                    : 'border-transparent text-dark/30 hover:text-dark/60'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Carrusel ───────────────────────────── */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); onMouseUp() }}
      >
        {/* Scroll horizontal — arrastreable con mouse, swipe en mobile */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-2 select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', gap: '32px', cursor: 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-44 sm:w-52">
                  <div className="h-[220px] bg-dark/[0.04] animate-pulse rounded-xl" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-dark/[0.04] animate-pulse w-12 rounded" />
                    <div className="h-3 bg-dark/[0.06] animate-pulse w-32 rounded" />
                    <div className="h-3 bg-dark/[0.04] animate-pulse w-16 rounded" />
                  </div>
                </div>
              ))
            : productos.map(p => {
                const img = p.imagenUrl?.includes('|')
                  ? p.imagenUrl.split('|')[0].trim()
                  : p.imagenUrl

                return (
                  <Link
                    key={p.id}
                    href={`/${segment}/producto/${p.id}`}
                    className="flex-shrink-0 w-44 sm:w-52 group cursor-pointer"
                    style={{ transition: 'transform 0.25s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    onClick={e => { if (dragRef.current.moved) e.preventDefault() }}
                  >
                    {/* Imagen */}
                    <div
                      className="relative overflow-hidden flex items-center justify-center"
                      style={{ height: '220px', background: '#f8f8f8', borderRadius: '12px' }}
                    >
                      <Image
                        src={img || FALLBACK}
                        alt={p.nombre}
                        fill
                        unoptimized
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
                        onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
                      />
                    </div>

                    {/* Info */}
                    <div className="mt-4 space-y-1">
                      <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase' }}>
                        {p.marca?.nombre}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.35 }} className="line-clamp-2">
                        {p.nombre}
                      </p>
                      {p.precio != null && (
                        <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                          {formatarPrecio(p.precio)}
                        </p>
                      )}
                      {/* CTA hover — visible solo con group-hover */}
                      <p
                        className="transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                        style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#b09a7a', textTransform: 'uppercase' }}
                      >
                        Ver producto →
                      </p>
                    </div>
                  </Link>
                )
              })}

          {/* Ver todos */}
          {!loading && productos.length > 0 && (
            <Link
              href={`/${segment}/coleccion/${col.slug}`}
              className="flex-shrink-0 w-44 sm:w-52 group"
              style={{ transition: 'transform 0.25s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                className="flex flex-col items-center justify-center gap-3 group-hover:border-dark/30 transition-colors duration-200"
                style={{ height: '220px', background: '#f8f8f8', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <span className="text-2xl text-dark/20 group-hover:text-dark/50 transition-colors duration-200">→</span>
                <p className="text-[9px] tracking-[0.28em] uppercase text-dark/30 group-hover:text-dark/60 transition-colors duration-200">
                  Ver todos
                </p>
              </div>
            </Link>
          )}

          <div className="flex-shrink-0 w-2" />
        </div>


      </div>

    </section>
  )
}

