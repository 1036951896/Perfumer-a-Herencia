import { Segment } from '@/types'

/**
 * Genera una referencia de pedido en formato: HP-YYYY-XXXX
 * HP = Herencia Perfumeria
 * YYYY = Año
 * XXXX = Número aleatorio de 4 dígitos
 */
export function generarReferenciaPedido(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `HP-${year}-${random}`
}

/**
 * Obtiene el segment guardado en localStorage
 */
export function getSegmentoGuardado(): Segment | null {
  if (typeof window === 'undefined') return null
  const segmento = localStorage.getItem('segment')
  return (segmento as Segment) || null
}

/**
 * Guarda el segment en localStorage
 */
export function guardarSegmento(segment: Segment): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('segment', segment)
}

/**
 * Valida si un segmento es válido
 */
export function esSegmentoValido(valor: string): valor is Segment {
  return ['original', 'replicas'].includes(valor)
}

/**
 * Formatea un precio para mostrar
 */
export function formatarPrecio(precio: number | null | undefined): string {
  if (!precio) return 'Consultar precio'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}

/**
 * Formatea un precio en pesos para el panel admin
 */
export function formatCurrency(precio: number | null | undefined): string {
  if (!precio) return '$0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}

/**
 * Calcula el total de un carrito
 */
export function calcularTotal(
  items: Array<{ cantidad: number; precio: number }>
): number {
  return items.reduce((total, item) => total + item.cantidad * item.precio, 0)
}

/**
 * Crea un mensaje para WhatsApp con el resumen del pedido
 */
export function crearMensajeWhatsApp(
  referencia: string,
  items: Array<{ nombre: string; cantidad: number; precio: number }>,
  total: number
): string {
  const lineas = [
    'Hola, me gustaría hacer un pedido de Herencia Perfumería',
    '',
    `Referencia: ${referencia}`,
    '',
    'Productos:',
  ]

  items.forEach((item) => {
    lineas.push(
      `• ${item.nombre} - ${item.cantidad}x ${formatarPrecio(item.precio)}`
    )
  })

  lineas.push('')
  lineas.push(`Total: ${formatarPrecio(total)}`)

  return encodeURIComponent(lineas.join('\n'))
}

/**
 * Delay helper para simular operaciones
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Valida un email
 */
export function esEmailValido(email: string): boolean {
  const re =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Formatea una fecha
 */
export function formatarFecha(fecha: Date | string): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
