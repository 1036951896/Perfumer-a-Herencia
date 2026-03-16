import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET — devuelve configuración de todas las pasarelas
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req)
  if (unauthorized) return unauthorized
  try {
    const configs = await prisma.configPasarela.findMany()
    return NextResponse.json({ datos: configs })
  } catch {
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

// PUT — crea o actualiza configuración de una pasarela
export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin(req)
  if (unauthorized) return unauthorized
  try {
    const body = await req.json()
    const { proveedor, activo, mpPublicKey, mpAccessToken, addiAlias, addiApiKey, nombreVisible, notas } = body

    if (!proveedor) {
      return NextResponse.json({ error: 'proveedor requerido' }, { status: 400 })
    }

    const config = await prisma.configPasarela.upsert({
      where: { proveedor },
      create: { proveedor, activo: activo ?? false, mpPublicKey, mpAccessToken, addiAlias, addiApiKey, nombreVisible, notas },
      update: { activo, mpPublicKey, mpAccessToken, addiAlias, addiApiKey, nombreVisible, notas },
    })

    return NextResponse.json({ datos: config })
  } catch {
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 })
  }
}
