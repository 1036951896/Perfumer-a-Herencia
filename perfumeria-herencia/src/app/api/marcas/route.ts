import { NextResponse } from 'next/server'
import { MarcaService } from '@/services'

export async function GET() {
  try {
    const marcas = await MarcaService.obtenerActivas()

    return NextResponse.json({
      exito: true,
      datos: marcas,
    })
  } catch (error) {
    console.error('Error en GET /api/marcas:', error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: 'Error al obtener marcas',
      },
      { status: 500 }
    )
  }
}
