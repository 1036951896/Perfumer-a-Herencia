import { NextRequest, NextResponse } from 'next/server'
import { ColeccionService } from '@/services'
import { requireAdmin } from '@/lib/auth'

/** GET /api/admin/colecciones?segmento=ORIGINAL */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized
  try {
    const { searchParams } = new URL(request.url)
    const segmento = searchParams.get('segmento') || undefined

    const colecciones = await ColeccionService.obtenerTodas(segmento)
    return NextResponse.json({ exito: true, datos: colecciones })
  } catch (error) {
    console.error('GET /api/admin/colecciones:', error)
    return NextResponse.json(
      { exito: false, mensaje: 'Error al obtener colecciones' },
      { status: 500 }
    )
  }
}

/** POST /api/admin/colecciones  →  crear colección */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()

    const { nombre, slug, descripcion, seoTitle, seoDescription,
            imagenUrl, bannerUrl, orden, destacado, segmento } = body

    if (!nombre || !segmento) {
      return NextResponse.json(
        { exito: false, mensaje: 'nombre y segmento son obligatorios' },
        { status: 400 }
      )
    }

    const coleccion = await ColeccionService.crear({
      nombre,
      slug: slug || ColeccionService.generarSlug(nombre),
      descripcion,
      seoTitle,
      seoDescription,
      imagenUrl,
      bannerUrl,
      orden: Number(orden) || 0,
      destacado: Boolean(destacado),
      segmento,
    })

    return NextResponse.json({ exito: true, datos: coleccion }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/colecciones:', error)
    return NextResponse.json(
      { exito: false, mensaje: error.message || 'Error al crear colección' },
      { status: 400 }
    )
  }
}
