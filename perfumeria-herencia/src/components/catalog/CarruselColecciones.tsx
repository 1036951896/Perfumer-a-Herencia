'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Coleccion } from '@/types'

interface CarruselColeccionesProps {
  segment: 'original' | 'replicas'
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='500'%3E%3Crect width='1200' height='500' fill='%23F4F2EE'/%3E%3C/svg%3E"

export function CarruselColecciones({ segment }: CarruselColeccionesProps) {
  const router = useRouter()
  const [colecciones, setColecciones] = useState<Coleccion[]>([])
  const [activo, setActivo] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  /* ── Cargar datos ────────────────────────────────────── */
  useEffect(() => {
    const segType = segment === 'original' ? 'ORIGINAL' : 'REPLICA'
    fetch(`/api/colecciones?segmento=${segType}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.datos?.length) setColecciones(d.datos)
      })
      .catch(() => {})
  }, [segment])

  /* ── Autoplay ────────────────────────────────────────── */
  const goTo = useCallback(
    (index: number) => {
      if (!colecciones.length) return
      setActivo(((index % colecciones.length) + colecciones.length) % colecciones.length)
    },
    [colecciones.length]
  )

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!paused) setActivo((a) => (a + 1) % colecciones.length)
    }, 6000)
  }, [paused, colecciones.length])

  useEffect(() => {
    if (!colecciones.length) return
    restart()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [colecciones.length, restart])

  /* ── Progress bar ────────────────────────────────────── */
  useEffect(() => {
    const el = progressRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.width = '0%'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!paused) {
          el.style.transition = 'width 6s linear'
          el.style.width = '100%'
        }
      })
    })
  }, [activo, paused])

  if (!colecciones.length) return null

  return (
    <div
      className="herencia-carrusel-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        height: 'clamp(280px, 52vh, 580px)',
        overflow: 'hidden',
        marginBottom: '64px',
      }}
    >
      {/* ── Slides ───────────────────────────────────── */}
      {colecciones.map((c, i) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === activo ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(.4,0,.2,1)',
            pointerEvents: i === activo ? 'auto' : 'none',
            zIndex: i === activo ? 1 : 0,
          }}
        >
          {/* Imagen de fondo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: i === activo ? 'hcKenBurns 8s ease-out forwards' : 'none',
            }}
          >
            <Image
              src={c.imagenUrl || c.bannerUrl || FALLBACK_IMG}
              alt={c.nombre}
              fill
              priority={i === 0}
              unoptimized
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = FALLBACK_IMG
              }}
            />
          </div>

          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(160deg, rgba(17,17,17,.38) 0%, rgba(17,17,17,.62) 55%, rgba(17,17,17,.78) 100%)',
            }}
          />

          {/* Contenido */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 40px',
              color: 'rgba(255,255,255,.94)',
              opacity: i === activo ? 1 : 0,
              transform: i === activo ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity .85s ease .35s, transform .85s ease .35s',
            }}
          >
            {c.destacado && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 14px',
                  background: 'transparent',
                  border: '1px solid #C2A27A',
                  color: '#C2A27A',
                  fontSize: '.58rem',
                  textTransform: 'uppercase',
                  letterSpacing: '.32em',
                  marginBottom: '16px',
                }}
              >
                Trending
              </span>
            )}

            <p
              style={{
                fontSize: '.6rem',
                textTransform: 'uppercase',
                letterSpacing: '.38em',
                color: '#C2A27A',
                marginBottom: '14px',
              }}
            >
              {segment === 'original' ? 'Colección Signature' : 'Colección Inspired'}
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                fontWeight: 300,
                letterSpacing: '.04em',
                lineHeight: 1.1,
                marginBottom: '14px',
                color: '#fff',
              }}
            >
              {c.nombre}
            </h2>

            {c.descripcion && (
              <p
                style={{
                  fontSize: '.82rem',
                  fontWeight: 300,
                  letterSpacing: '.05em',
                  color: 'rgba(255,255,255,.55)',
                  maxWidth: '460px',
                  lineHeight: 1.75,
                  marginBottom: '24px',
                }}
              >
                {c.descripcion}
              </p>
            )}

            <button
              onClick={() => router.push(`/${segment}/coleccion/${c.slug}`)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '.62rem',
                textTransform: 'uppercase',
                letterSpacing: '.22em',
                color: 'rgba(255,255,255,.7)',
                borderBottom: '1px solid rgba(255,255,255,.35)',
                paddingBottom: '3px',
                marginTop: '4px',
                transition: 'color .3s, border-color .3s',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.color = '#C2A27A'
                ;(e.target as HTMLButtonElement).style.borderBottomColor = '#C2A27A'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,.7)'
                ;(e.target as HTMLButtonElement).style.borderBottomColor =
                  'rgba(255,255,255,.35)'
              }}
            >
              Explorar →
            </button>
          </div>
        </div>
      ))}

      {/* ── Indicadores ──────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {colecciones.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => { goTo(i); restart() }}
            style={{
              height: '1.5px',
              width: i === activo ? '36px' : '20px',
              background:
                i === activo ? '#C2A27A' : 'rgba(255,255,255,.3)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width .4s ease, background .4s ease',
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ─────────────────────────────── */}
      <div
        ref={progressRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: '#C2A27A',
          width: '0%',
          zIndex: 10,
          opacity: 0.65,
        }}
      />

      {/* Ken Burns keyframes (inyectado inline para autocontenido) */}
      <style>{`
        @keyframes hcKenBurns {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.07) translate(-0.5%, -0.5%); }
        }
      `}</style>
    </div>
  )
}
