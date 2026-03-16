import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, verifySessionToken } from '@/lib/session'

/** Devuelve null si el request tiene sesión válida, o una respuesta 401 si no. */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ exito: false, mensaje: 'No autorizado' }, { status: 401 })
  }
  return null
}
