import { NextRequest, NextResponse } from 'next/server'
import { ProductoService } from '@/services'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await ProductoService.obtenerPorId(params.id)

    return NextResponse.json({
      exito: true,
      datos: producto,
    })
  } catch (error: any) {
    console.error('Error en GET /api/productos/[id]:', error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: error.message || 'Producto no encontrado',
      },
      { status: 404 }
    )
  }
}
