'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.exito) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.mensaje || 'Credenciales incorrectas')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium tracking-widest text-gray-900">HERENCIA</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-[0.3em] uppercase">Panel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              required
              autoFocus
              autoComplete="username"
              value={form.usuario}
              onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-wide uppercase mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.contrasena}
              onChange={e => setForm(f => ({ ...f, contrasena: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-wait mt-2"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
