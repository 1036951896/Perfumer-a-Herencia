'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OPCIONES = [
  { value: 'PENDIENTE',  label: 'Pendiente',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'EN_PROCESO', label: 'En proceso',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'ENVIADO',    label: 'Enviado',     color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'ENTREGADO',  label: 'Entregado',   color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'CANCELADO',  label: 'Cancelado',   color: 'bg-gray-50 text-gray-500 border-gray-200' },
]

interface Props {
  pedidoId: string
  estadoActual: string
}

export default function CambiarEstadoPedido({ pedidoId, estadoActual }: Props) {
  const router = useRouter()
  const [estado, setEstado] = useState(estadoActual)
  const [guardando, setGuardando] = useState(false)

  const opcionActual = OPCIONES.find(o => o.value === estado) ?? OPCIONES[0]

  async function cambiarEstado(nuevoEstado: string) {
    if (nuevoEstado === estado) return
    setGuardando(true)
    setEstado(nuevoEstado)
    try {
      await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      router.refresh()
    } catch {
      setEstado(estado)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="relative inline-block">
      <select
        value={estado}
        disabled={guardando}
        onChange={e => cambiarEstado(e.target.value)}
        className={`text-xs px-2 py-1 rounded border cursor-pointer appearance-none pr-6 disabled:opacity-60 disabled:cursor-wait font-medium ${opcionActual.color}`}
      >
        {OPCIONES.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px]">▼</span>
    </div>
  )
}
