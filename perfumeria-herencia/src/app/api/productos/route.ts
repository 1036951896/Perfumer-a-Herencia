import { NextRequest, NextResponse } from 'next/server'
import { ProductoService } from '@/services'
import { TipoProducto, Genero } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const segmento = searchParams.get('segmento') as TipoProducto | null
    const genero = searchParams.get('genero') as Genero | null
    const marcaId = searchParams.get('marcaId') as string | null
    const categoriaId = searchParams.get('categoriaId') as string | null
    const busqueda = searchParams.get('busqueda') as string | null
    const coleccionSlug = searchParams.get('coleccionSlug') as string | null
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '12')

    const resultado = await ProductoService.obtenerConFiltros({
      segmento: segmento || undefined,
      genero: genero || undefined,
      marcaId: marcaId || undefined,
      categoriaId: categoriaId || undefined,
      busqueda: busqueda || undefined,
      coleccionSlug: coleccionSlug || undefined,
      pagina,
      limite,
    })

    return NextResponse.json({
      exito: true,
      ...resultado,
    })
  } catch (error) {
    console.error('Error en GET /api/productos:', error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: 'Error al obtener productos',
      },
      { status: 500 }
    )
  }
}
