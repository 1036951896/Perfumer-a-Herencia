'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Coleccion, CrearColeccionDTO, ActualizarColeccionDTO, Producto } from '@/types'

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
type SegmentoFilter = 'TODOS' | 'ORIGINAL' | 'REPLICA'

const SEGMENTOS: { value: SegmentoFilter; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ORIGINAL', label: 'Original' },
  { value: 'REPLICA', label: 'Réplica' },
]

const SEGMENTO_OPTS = [
  { value: 'ORIGINAL', label: 'Original' },
  { value: 'REPLICA', label: 'Réplica' },
]

const BLANK_FORM: {
  nombre: string
  slug: string
  descripcion: string
  seoTitle: string
  seoDescription: string
  imagenUrl: string
  bannerUrl: string
  orden: string
  destacado: boolean
  segmento: 'ORIGINAL' | 'REPLICA'
} = {
  nombre: '',
  slug: '',
  descripcion: '',
  seoTitle: '',
  seoDescription: '',
  imagenUrl: '',
  bannerUrl: '',
  orden: '0',
  destacado: false,
  segmento: 'ORIGINAL',
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default function AdminColeccionesPage() {
  const [colecciones, setColecciones] = useState<Coleccion[]>([])
  const [loading, setLoading] = useState(true)
  const [segFilter, setSegFilter] = useState<SegmentoFilter>('TODOS')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...BLANK_FORM })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Product assignment panel
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignColeccion, setAssignColeccion] = useState<Coleccion | null>(null)
  const [allProductos, setAllProductos] = useState<Producto[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [assignSaving, setAssignSaving] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  /* ── Loaders ─────────────────────────────────────────── */
  const cargarColecciones = async () => {
    setLoading(true)
    try {
      const url =
        segFilter === 'TODOS'
          ? '/api/admin/colecciones'
          : `/api/admin/colecciones?segmento=${segFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setColecciones(data.datos || [])
    } catch {
      /* noop */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarColecciones() }, [segFilter]) // eslint-disable-line

  /* ── Inline toggles ──────────────────────────────────── */
  const toggleField = async (id: string, field: 'activo' | 'destacado', current: boolean) => {
    await fetch(`/api/admin/colecciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    setColecciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: !current } : c))
    )
  }

  const updateOrden = async (id: string, orden: number) => {
    await fetch(`/api/admin/colecciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orden }),
    })
    setColecciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, orden } : c))
    )
  }

  /* ── CRUD modal ──────────────────────────────────────── */
  const openCreate = () => {
    setEditingId(null)
    setForm({ ...BLANK_FORM })
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (col: Coleccion) => {
    setEditingId(col.id)
    setForm({
      nombre: col.nombre,
      slug: col.slug,
      descripcion: col.descripcion || '',
      seoTitle: col.seoTitle || '',
      seoDescription: col.seoDescription || '',
      imagenUrl: col.imagenUrl || '',
      bannerUrl: col.bannerUrl || '',
      orden: String(col.orden),
      destacado: col.destacado,
      segmento: col.segmento as 'ORIGINAL' | 'REPLICA',
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    // Auto-slug from nombre when creating
    if (name === 'nombre' && !editingId) {
      setForm((prev) => ({
        ...prev,
        nombre: value,
        slug: value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      const payload = {
        nombre: form.nombre,
        slug: form.slug,
        descripcion: form.descripcion || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        imagenUrl: form.imagenUrl || undefined,
        bannerUrl: form.bannerUrl || undefined,
        orden: parseInt(form.orden, 10) || 0,
        destacado: form.destacado,
        segmento: form.segmento,
      }

      const url = editingId
        ? `/api/admin/colecciones/${editingId}`
        : '/api/admin/colecciones'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')

      setModalOpen(false)
      await cargarColecciones()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta colección?')) return
    await fetch(`/api/admin/colecciones/${id}`, { method: 'DELETE' })
    setColecciones((prev) => prev.filter((c) => c.id !== id))
  }

  /* ── Product assignment ──────────────────────────────── */
  const openAssign = async (col: Coleccion) => {
    setAssignColeccion(col)
    setProductSearch('')
    setAssignSaving(false)

    // Fetch products for this segment
    const [prodsRes, colRes] = await Promise.all([
      fetch(`/api/productos?segmento=${col.segmento}&limite=200`),
      fetch(`/api/admin/colecciones/${col.id}`),
    ])
    const prodsData = await prodsRes.json()
    const colData = await colRes.json()

    setAllProductos(prodsData.datos || [])
    const assignedIds = new Set<string>(
      (colData.datos?.productos || []).map((p: Producto) => p.id)
    )
    setSelectedIds(assignedIds)
    setAssignOpen(true)
  }

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const saveAssignment = async () => {
    if (!assignColeccion) return
    setAssignSaving(true)
    try {
      await fetch(`/api/admin/colecciones/${assignColeccion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoIds: Array.from(selectedIds) }),
      })
      await cargarColecciones()
      setAssignOpen(false)
    } finally {
      setAssignSaving(false)
    }
  }

  /* ── Helpers ──────────────────────────────────────────── */
  const filteredProductos = allProductos.filter((p) => {
    if (!productSearch) return true
    const q = productSearch.toLowerCase()
    return p.nombre.toLowerCase().includes(q) || p.marca?.nombre?.toLowerCase().includes(q)
  })

  /* ────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────── */
  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Colecciones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona colecciones comerciales y asigna productos
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded hover:bg-gray-700 transition-colors"
        >
          + Nueva colección
        </button>
      </div>

      {/* ── Segment filter tabs ── */}
      <div className="flex gap-2 mb-6">
        {SEGMENTOS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSegFilter(s.value)}
            className={`text-sm px-4 py-1.5 rounded border transition-colors ${
              segFilter === s.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-600 border-gray-300 hover:border-gray-500'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : colecciones.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No hay colecciones aún. Crea la primera.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Nombre / Slug</th>
                <th className="px-4 py-3 text-left">Segmento</th>
                <th className="px-4 py-3 text-center">Productos</th>
                <th className="px-4 py-3 text-center">Orden</th>
                <th className="px-4 py-3 text-center">Activo</th>
                <th className="px-4 py-3 text-center">
                  <span className="block">Destacado</span>
                  <span className="block text-[10px] font-normal text-amber-500 tracking-tight">= aparece en carrusel</span>
                </th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {colecciones.map((col) => (
                <tr key={col.id} className="hover:bg-gray-50 transition-colors">
                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{col.nombre}</div>
                    <div className="text-xs text-gray-400 mt-0.5">/{col.slug}</div>
                  </td>

                  {/* Segmento */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        col.segmento === 'ORIGINAL'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {col.segmento === 'ORIGINAL' ? 'Original' : 'Réplica'}
                    </span>
                  </td>

                  {/* Productos */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openAssign(col)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {col._count?.productos ?? 0} productos
                    </button>
                  </td>

                  {/* Orden */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      defaultValue={col.orden}
                      className="w-16 text-center border border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10)
                        if (!isNaN(val) && val !== col.orden) updateOrden(col.id, val)
                      }}
                    />
                  </td>

                  {/* Activo toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(col.id, 'activo', col.activo)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        col.activo ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={col.activo ? 'Desactivar' : 'Activar'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          col.activo ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Destacado toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(col.id, 'destacado', col.destacado)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        col.destacado ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                      title={col.destacado ? 'Quitar destacado' : 'Destacar'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          col.destacado ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(col)}
                        className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-2.5 py-1 rounded hover:border-gray-400 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(col.id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2.5 py-1 rounded hover:border-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          Modal: Crear / Editar colección
      ═══════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">
                {editingId ? 'Editar colección' : 'Nueva colección'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </p>
              )}

              {/* Nombre + Segmento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Oud Collection"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Segmento *</label>
                  <select
                    name="segmento"
                    value={form.segmento}
                    onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  >
                    {SEGMENTO_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="oud-collection"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL imagen card</label>
                  <input
                    name="imagenUrl"
                    value={form.imagenUrl}
                    onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL banner hero</label>
                  <input
                    name="bannerUrl"
                    value={form.bannerUrl}
                    onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* SEO */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">SEO Title</label>
                <input
                  name="seoTitle"
                  value={form.seoTitle}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Oud Collection | Herencia Perfumería"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">SEO Description</label>
                <textarea
                  name="seoDescription"
                  value={form.seoDescription}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                />
              </div>

              {/* Orden + Destacado */}
              <div className="flex items-center gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Orden</label>
                  <input
                    name="orden"
                    type="number"
                    value={form.orden}
                    onChange={handleFormChange}
                    className="w-20 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    name="destacado"
                    type="checkbox"
                    checked={form.destacado}
                    onChange={handleFormChange}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span className="text-sm text-gray-700">
                    Destacado
                    <span className="block text-xs text-amber-600 font-normal">aparece en el carrusel «Selección Curada»</span>
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gray-900 text-white text-sm px-5 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear colección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          Product assignment panel (slide-over)
      ═══════════════════════════════════════════════ */}
      {assignOpen && assignColeccion && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setAssignOpen(false)}
          />
          {/* panel */}
          <div className="bg-white w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="font-medium text-gray-900">Asignar productos</h2>
                <p className="text-xs text-gray-500 mt-0.5">{assignColeccion.nombre}</p>
              </div>
              <button onClick={() => setAssignOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
                ×
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filteredProductos.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">Sin resultados</p>
              ) : (
                filteredProductos.map((p) => {
                  const checked = selectedIds.has(p.id)
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        checked ? 'bg-amber-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(p.id)}
                        className="w-4 h-4 rounded accent-amber-500 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{p.nombre}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {p.marca?.nombre} · {p.genero}
                        </div>
                      </div>
                      {checked && (
                        <span className="ml-auto text-xs text-amber-600 flex-shrink-0">✓</span>
                      )}
                    </label>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex justify-end gap-3">
              <button
                onClick={() => setAssignOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={saveAssignment}
                disabled={assignSaving}
                className="bg-gray-900 text-white text-sm px-5 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {assignSaving ? 'Guardando...' : 'Guardar asignación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
