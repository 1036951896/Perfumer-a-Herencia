'use client'

import { useState, useEffect } from 'react'
import { Producto, FiltroProductos, TipoProducto, Marca } from '@/types'
import { ProductCard } from '@/components/catalog/ProductCard'
import { FiltroBuscador } from '@/components/catalog/FiltroBuscador'
import { Paginacion } from '@/components/catalog/Paginacion'

interface CatalogoPorSegmentoProps {
  segment: 'original' | 'replicas'
}

export function CatalogoPorSegmento({ segment }: CatalogoPorSegmentoProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [generos, setGeneros] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState<FiltroProductos>({
    tipo: segment === 'original' ? 'ORIGINAL' : 'REPLICA',
  })

  // Cargar marcas y géneros al montar
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [marcasRes, generosRes] = await Promise.all([
          fetch('/api/marcas'),
          fetch('/api/generos'),
        ])

        if (marcasRes.ok) {
          const data = await marcasRes.json()
          setMarcas(data.datos || [])
        }

        if (generosRes.ok) {
          const data = await generosRes.json()
          setGeneros(data.datos || [])
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
      }
    }

    cargarDatosIniciales()
  }, [])

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()
        if (filtros.tipo) queryParams.append('tipo', filtros.tipo)
        if (filtros.genero) queryParams.append('genero', filtros.genero)
        if (filtros.marcaId)
          queryParams.append('marcaId', filtros.marcaId)
        if (filtros.busqueda)
          queryParams.append('busqueda', filtros.busqueda)
        queryParams.append('pagina', (pagina || 1).toString())
        queryParams.append('limite', '12')

        const response = await fetch(
          `/api/productos?${queryParams.toString()}`
        )

        if (!response.ok) {
          throw new Error('Error al cargar productos')
        }

        const data = await response.json()
        setProductos(data.datos || [])
        setTotalPaginas(data.totalPaginas || 1)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Error desconocido'
        )
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
      tipo:
        segment === 'original'
          ? ('ORIGINAL' as TipoProducto)
          : ('REPLICA' as TipoProducto),
    })
    setPagina(nuevosFiltros.pagina || 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header Editorial */}
        <div className="mb-20 animate-fade-in">
          <p className="text-xs tracking-widest uppercase text-dark/40 mb-6">
            Colección Permanente
          </p>

          <h1 className="font-serif text-5xl font-light leading-tight max-w-2xl text-dark">
            {segment === 'original'
              ? 'Fragancias que definen carácter y presencia.'
              : 'Interpretaciones inspiradas en la elegancia clásica.'}
          </h1>
        </div>

        {/* Filtros */}
        <div className="border-t border-dark/10 py-6 mb-16">
          <FiltroBuscador
            onFiltrosChange={handleFiltrosChange}
            marcas={marcas}
            generos={generos}
            loading={loading}
          />
        </div>

        {/* Texto curado */}
        <p className="text-center text-xs tracking-widest uppercase text-dark/30 mb-16">
          Selección curada · Edición permanente
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
            <p className="text-dark/40 text-sm tracking-wider">Cargando colección...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/50 text-base font-light">
              No encontramos fragancias con esos criterios.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  segment={segment}
                />
              ))}
            </div>

            {/* Paginación */}
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
