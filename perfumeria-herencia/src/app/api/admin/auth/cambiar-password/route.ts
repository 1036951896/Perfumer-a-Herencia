import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { COOKIE_NAME, verifySessionToken } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ exito: false, mensaje: 'No autorizado' }, { status: 401 })
    }

    const { contrasenaActual, contrasenaNueva } = await request.json()

    if (!contrasenaNueva || contrasenaNueva.length < 6) {
      return NextResponse.json(
        { exito: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const config = await prisma.adminConfig.findUnique({ where: { id: 'admin' } })
    if (!config) {
      return NextResponse.json({ exito: false, mensaje: 'Configuración no encontrada' }, { status: 404 })
    }

    const valid = await bcrypt.compare(contrasenaActual, config.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { exito: false, mensaje: 'La contraseña actual es incorrecta' },
        { status: 401 }
      )
    }

    const newHash = await bcrypt.hash(contrasenaNueva, 10)
    await prisma.adminConfig.update({
      where: { id: 'admin' },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ exito: true, mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Cambiar contraseña error:', error)
    return NextResponse.json({ exito: false, mensaje: 'Error del servidor' }, { status: 500 })
  }
}
