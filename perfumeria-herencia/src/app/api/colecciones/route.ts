import { NextRequest, NextResponse } from 'next/server'
import { ColeccionService } from '@/services'

/** GET /api/colecciones?segmento=ORIGINAL  →  colecciones activas */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const segmento = searchParams.get('segmento') || 'ORIGINAL'

    const colecciones = await ColeccionService.obtenerActivas(segmento)

    return NextResponse.json({ exito: true, datos: colecciones })
  } catch (error) {
    console.error('GET /api/colecciones:', error)
    return NextResponse.json(
      { exito: false, mensaje: 'Error al obtener colecciones' },
      { status: 500 }
    )
  }
}
