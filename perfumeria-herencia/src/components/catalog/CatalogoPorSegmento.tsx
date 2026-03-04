'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Producto, FiltroProductos, TipoProducto, Marca, Coleccion } from '@/types'
import { ProductCard } from '@/components/catalog/ProductCard'
import { FiltroBuscador } from '@/components/catalog/FiltroBuscador'
import { Paginacion } from '@/components/catalog/Paginacion'
import { CarruselColecciones } from '@/components/catalog/CarruselColecciones'

interface CatalogoPorSegmentoProps {
  segment: 'original' | 'replicas'
  /** Si viene definido, filtra por colección y muestra su hero */
  coleccionSlug?: string
}

export function CatalogoPorSegmento({ segment, coleccionSlug }: CatalogoPorSegmentoProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [generos, setGeneros] = useState<string[]>([])
  const [coleccion, setColeccion] = useState<Coleccion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState<FiltroProductos>({
    segmento: segment === 'original' ? 'ORIGINAL' : 'REPLICA',
    coleccionSlug: coleccionSlug,
  })

  // Cargar marcas, géneros y datos de colección al montar
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const promises: Promise<any>[] = [
          fetch('/api/marcas').then((r) => r.json()),
          fetch('/api/generos').then((r) => r.json()),
        ]

        if (coleccionSlug) {
          const segType = segment === 'original' ? 'ORIGINAL' : 'REPLICA'
          promises.push(
            fetch(`/api/colecciones?segmento=${segType}`)
              .then((r) => r.json())
              .then((d) => (d.datos || []).find((c: Coleccion) => c.slug === coleccionSlug) || null)
          )
        }

        const [marcasData, generosData, colData] = await Promise.all(promises)
        setMarcas(marcasData.datos || [])
        setGeneros(generosData.datos || [])
        if (colData !== undefined) setColeccion(colData)
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
      }
    }

    cargarDatosIniciales()
  }, [segment, coleccionSlug])

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()
        if (filtros.segmento) queryParams.append('segmento', filtros.segmento)
        if (filtros.genero) queryParams.append('genero', filtros.genero)
        if (filtros.marcaId) queryParams.append('marcaId', filtros.marcaId)
        if (filtros.busqueda) queryParams.append('busqueda', filtros.busqueda)
        if (filtros.coleccionSlug) queryParams.append('coleccionSlug', filtros.coleccionSlug)
        queryParams.append('pagina', (pagina || 1).toString())
        queryParams.append('limite', '12')

        const response = await fetch(`/api/productos?${queryParams.toString()}`)

        if (!response.ok) throw new Error('Error al cargar productos')

        const data = await response.json()
        setProductos(data.datos || [])
        setTotalPaginas(data.totalPaginas || 1)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [filtros, pagina])

  const handleFiltrosChange = (nuevosFiltros: FiltroProductos) => {
    setFiltros({
      ...filtros,
      ...nuevosFiltros,
      segmento: segment === 'original' ? ('ORIGINAL' as TipoProducto) : ('REPLICA' as TipoProducto),
      coleccionSlug: coleccionSlug,
    })
    setPagina(nuevosFiltros.pagina || 1)
  }

  /* ── Hero de colección ───────────────────────────────── */
  const ColeccionHero = () => {
    if (!coleccion) return null
    const bg = coleccion.bannerUrl || coleccion.imagenUrl

    return (
      <div className="relative w-full mb-16" style={{ height: 'clamp(220px, 40vh, 480px)' }}>
        {bg ? (
          <Image
            src={bg}
            alt={coleccion.nombre}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-dark/8" />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg,rgba(17,17,17,.38) 0%,rgba(17,17,17,.62) 55%,rgba(17,17,17,.78) 100%)',
          }}
        />
        {/* Texto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
          {coleccion.destacado && (
            <span
              className="inline-block mb-4 text-[.58rem] tracking-[.32em] uppercase border px-3 py-1"
              style={{ borderColor: '#C2A27A', color: '#C2A27A' }}
            >
              Trending
            </span>
          )}
          <p className="text-[.6rem] tracking-[.38em] uppercase mb-3" style={{ color: '#C2A27A' }}>
            {segment === 'original' ? 'Colección Signature' : 'Colección Inspired'}
          </p>
          <h1 className="font-serif text-white font-light leading-tight mb-3"
              style={{ fontSize: 'clamp(1.8rem,4.5vw,3.2rem)' }}>
            {coleccion.nombre}
          </h1>
          {coleccion.descripcion && (
            <p className="max-w-lg text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,.55)' }}>
              {coleccion.descripcion}
            </p>
          )}
        </div>
        {/* Volver */}
        <Link
          href={`/${segment}`}
          className="absolute top-5 left-5 text-[.62rem] tracking-widest uppercase z-10"
          style={{ color: 'rgba(255,255,255,.6)', borderBottom: '1px solid rgba(255,255,255,.3)' }}
        >
          ← Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero de colección o carrusel */}
        {coleccionSlug ? <ColeccionHero /> : <CarruselColecciones segment={segment} />}

        {/* Hero editorial (solo sin colección) */}
        {!coleccionSlug && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-center py-24"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-dark/35 mb-6">
              {segment === 'original' ? 'Colección Signature' : 'Colección Inspired'}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-dark">
              {segment === 'original'
                ? 'Fragancias que definen carácter.'
                : 'Elegancia inspirada en lo eterno.'}
            </h2>
            {/* Separador dorado árabe */}
            <div className="w-16 h-[1px] bg-accent mx-auto mt-8 mb-6" />
            <p className="max-w-xl mx-auto text-dark/50 text-sm leading-relaxed">
              {segment === 'original'
                ? 'Una selección curada que fusiona elegancia contemporánea con la profundidad del lujo árabe.'
                : 'Interpretaciones precisas de las grandes casas perfumeras, al alcance de quien aprecia lo bello.'}
            </p>
          </motion.section>
        )}

        {/* Filtros */}
        <div className="border-t border-dark/8 py-6 mb-16">
          <FiltroBuscador
            onFiltrosChange={handleFiltrosChange}
            marcas={marcas}
            generos={generos}
            loading={loading}
          />
        </div>

        {/* Texto curado */}
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-dark/25 mb-16">
          {coleccion
            ? `${coleccion.nombre} · ${coleccion._count?.productos ?? ''} fragancias`
            : 'Selección curada · Edición permanente'}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Productos */}
        {loading && productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/30 text-xs tracking-[0.3em] uppercase">Cargando colección...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/40 text-base font-light">
              No encontramos fragancias con esos criterios.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-10 mb-24">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} segment={segment} />
              ))}
            </div>
            <Paginacion
              pagina={pagina}
              totalPaginas={totalPaginas}
              onPaginaChange={setPagina}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  )
}

