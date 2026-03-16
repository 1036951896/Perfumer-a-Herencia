import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { estado } = body

    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
      return NextResponse.json(
        { exito: false, mensaje: 'Estado no válido' },
        { status: 400 }
      )
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado: estado as any },
    })

    return NextResponse.json({ exito: true, datos: pedido })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { exito: false, mensaje: 'Pedido no encontrado' },
        { status: 404 }
      )
    }
    console.error('PATCH /api/admin/pedidos/[id]:', error)
    return NextResponse.json(
      { exito: false, mensaje: 'Error al actualizar pedido' },
      { status: 500 }
    )
  }
}
