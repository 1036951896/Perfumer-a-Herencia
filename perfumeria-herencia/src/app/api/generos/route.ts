import { NextResponse } from 'next/server'
import { ProductoService } from '@/services'

export async function GET() {
  try {
    const generos = await ProductoService.obtenerGeneros()

    return NextResponse.json({
      exito: true,
      datos: generos,
    })
  } catch (error) {
    console.error('Error en GET /api/generos:', error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: 'Error al obtener géneros',
      },
      { status: 500 }
    )
  }
}
