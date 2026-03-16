'use client'

import { useState } from 'react'

export default function CuentaAdmin() {
  const [form, setForm] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmar: '',
  })
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.contrasenaNueva !== form.confirmar) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' })
      return
    }
    setCargando(true)
    setMensaje(null)
    try {
      const res = await fetch('/api/admin/auth/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contrasenaActual: form.contrasenaActual,
          contrasenaNueva: form.contrasenaNueva,
        }),
      })
      const data = await res.json()
      if (data.exito) {
        setMensaje({ tipo: 'ok', texto: 'Contraseña actualizada correctamente' })
        setForm({ contrasenaActual: '', contrasenaNueva: '', confirmar: '' })
      } else {
        setMensaje({ tipo: 'error', texto: data.mensaje || 'Error al actualizar' })
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-md">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Mi cuenta</h1>
        <p className="text-sm text-gray-500">Cambiar contraseña de acceso al panel</p>
      </header>

      <div className="bg-white border border-gray-200 rounded p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase mb-1.5">
              Contraseña actual
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.contrasenaActual}
              onChange={e => setForm(f => ({ ...f, contrasenaActual: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase mb-1.5">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.contrasenaNueva}
              onChange={e => setForm(f => ({ ...f, contrasenaNueva: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase mb-1.5">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirmar}
              onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          {mensaje && (
            <p className={`text-xs px-3 py-2 rounded border ${
              mensaje.tipo === 'ok'
                ? 'text-green-700 bg-green-50 border-green-100'
                : 'text-red-600 bg-red-50 border-red-100'
            }`}>
              {mensaje.texto}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {cargando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
