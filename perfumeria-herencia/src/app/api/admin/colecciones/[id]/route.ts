import { NextRequest, NextResponse } from 'next/server'
import { ColeccionService } from '@/services'

/** GET /api/admin/colecciones/[id] */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coleccion = await ColeccionService.obtenerPorId(params.id)
    return NextResponse.json({ exito: true, datos: coleccion })
  } catch (error: any) {
    return NextResponse.json({ exito: false, mensaje: error.message }, { status: 404 })
  }
}

/** PUT /api/admin/colecciones/[id] — actualiza colección y/o productos */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const coleccion = await ColeccionService.actualizar(params.id, body)
    return NextResponse.json({ exito: true, datos: coleccion })
  } catch (error: any) {
    console.error('PUT /api/admin/colecciones/[id]:', error)
    return NextResponse.json(
      { exito: false, mensaje: error.message || 'Error al actualizar' },
      { status: 400 }
    )
  }
}

/** DELETE /api/admin/colecciones/[id] */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ColeccionService.eliminar(params.id)
    return NextResponse.json({ exito: true, mensaje: 'Colección eliminada' })
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error.message || 'Error al eliminar' },
      { status: 400 }
    )
  }
}
