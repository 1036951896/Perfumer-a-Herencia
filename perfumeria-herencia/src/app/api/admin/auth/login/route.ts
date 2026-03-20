import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { usuario, contrasena } = await request.json()

    const adminUser = process.env.ADMIN_USER || 'admin'
    if (!usuario || !contrasena || usuario !== adminUser) {
      return NextResponse.json(
        { exito: false, mensaje: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Obtener config, o crear con contraseña por defecto la primera vez
    let config = await prisma.adminConfig.findUnique({ where: { id: 'admin' } })
    if (!config) {
      const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'Herencia2026'
      const hash = await bcrypt.hash(defaultPass, 10)
      config = await prisma.adminConfig.create({
        data: { id: 'admin', passwordHash: hash },
      })
    }

    const valid = await bcrypt.compare(contrasena, config.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { exito: false, mensaje: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    const token = await createSessionToken()
    const response = NextResponse.json({ exito: true })
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { exito: false, mensaje: 'Error del servidor' },
      { status: 500 }
    )
  }
}
