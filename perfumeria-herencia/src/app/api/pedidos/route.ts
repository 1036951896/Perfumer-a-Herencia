import { NextRequest, NextResponse } from 'next/server'
import { PedidoService } from '@/services'
import { CrearPedidoSchema } from '@/lib/validations'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    const datosValidados = CrearPedidoSchema.parse(body)

    // Crear pedido
    const pedido = await PedidoService.crear(datosValidados)

    return NextResponse.json(
      {
        exito: true,
        datos: pedido,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST /api/pedidos:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Datos inválidos',
          errores: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        exito: false,
        mensaje: error.message || 'Error al crear pedido',
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized
  try {
    const { searchParams } = new URL(request.url)
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const resultado = await PedidoService.obtenerTodos(pagina, limite)

    return NextResponse.json({
      exito: true,
      ...resultado,
    })
  } catch (error: any) {
    console.error('Error en GET /api/pedidos:', error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: 'Error al obtener pedidos',
      },
      { status: 500 }
    )
  }
}
