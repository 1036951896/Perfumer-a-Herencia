'use client'

import { useState, useCallback } from 'react'
import { FiltroProductos } from '@/types'

interface FiltroBuscadorProps {
  onFiltrosChange: (filtros: FiltroProductos) => void
  marcas: Array<{ id: string; nombre: string }>
  generos: string[]
  categorias?: Array<{ id: string; nombre: string }>
  loading?: boolean
}

export function FiltroBuscador({
  onFiltrosChange,
  marcas,
  generos,
  loading = false,
}: FiltroBuscadorProps) {
  const [busqueda, setBusqueda] = useState('')
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('')
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string>('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const handleFiltros = useCallback(() => {
    const filtros: FiltroProductos = {
      busqueda: busqueda || undefined,
      marcaId: marcaSeleccionada || undefined,
      genero: generoSeleccionado as any,
      categoriaId: categoriaSeleccionada || undefined,
      pagina: 1,
    }

    onFiltrosChange(filtros)
  }, [busqueda, marcaSeleccionada, generoSeleccionado, categoriaSeleccionada, onFiltrosChange])

  const handleLimpiar = () => {
    setBusqueda('')
    setMarcaSeleccionada('')
    setGeneroSeleccionado('')
    setCategoriaSeleccionada('')
    onFiltrosChange({
      pagina: 1,
    })
  }

  const tieneActivos =
    busqueda || marcaSeleccionada || generoSeleccionado || categoriaSeleccionada

  return (
    <div className="border-b border-dark/10 pb-6">
      {/* Filtros */}
      <div className={`grid md:grid-cols-5 gap-8 ${!mostrarFiltros ? 'hidden md:grid' : ''}`}>
        {/* Búsqueda */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-dark/40 mb-3">
            Buscar
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onBlur={handleFiltros}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFiltros()
              }
            }}
            placeholder="Nombre..."
            className="w-full py-2 bg-transparent border-b border-dark/20 focus:border-dark outline-none transition-colors text-sm"
          />
        </div>

        {/* Marca */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-dark/40 mb-3">
            Marca
          </label>
          <select
            value={marcaSeleccionada}
            onChange={(e) => {
              const valor = e.target.value
              setMarcaSeleccionada(valor)
              onFiltrosChange({
                busqueda: busqueda || undefined,
                marcaId: valor || undefined,
                genero: generoSeleccionado as any || undefined,
                pagina: 1,
              })
            }}
            className="w-full py-2 bg-transparent border-b border-dark/20 focus:border-dark outline-none transition-colors text-sm"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Género */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-dark/40 mb-3">
            Género
          </label>
          <select
            value={generoSeleccionado}
            onChange={(e) => {
              const valor = e.target.value
              setGeneroSeleccionado(valor)
              onFiltrosChange({
                busqueda: busqueda || undefined,
                marcaId: marcaSeleccionada || undefined,
                genero: valor as any || undefined,
                pagina: 1,
              })
            }}
            className="w-full py-2 bg-transparent border-b border-dark/20 focus:border-dark outline-none transition-colors text-sm"
          >
            <option value="">Todos</option>
            {generos.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0) + g.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        {categorias.length > 0 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-dark/40 mb-3">
              Categoría
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => {
                const valor = e.target.value
                setCategoriaSeleccionada(valor)
                onFiltrosChange({
                  busqueda: busqueda || undefined,
                  marcaId: marcaSeleccionada || undefined,
                  genero: generoSeleccionado as any || undefined,
                  categoriaId: valor || undefined,
                  pagina: 1,
                })
              }}
              className="w-full py-2 bg-transparent border-b border-dark/20 focus:border-dark outline-none transition-colors text-sm"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón Limpiar */}
        <div className="flex items-end">
          {tieneActivos && (
            <button
              onClick={handleLimpiar}
              disabled={loading}
              className="text-xs tracking-widest uppercase border-b border-dark/40 pb-1 hover:opacity-60 transition-opacity disabled:opacity-30"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Toggle mobile */}
      <button
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
        className="md:hidden mt-4 text-xs tracking-widest uppercase border-b border-dark pb-1"
      >
        {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>
    </div>
  )
}
