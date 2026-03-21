import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

/** POST /api/admin/marcas — crear marca */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { nombre, descripcion, paisOrigen } = await request.json()

    if (!nombre?.trim()) {
      return NextResponse.json(
        { exito: false, mensaje: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    const marca = await prisma.marca.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        paisOrigen: paisOrigen?.trim() || null,
      },
    })

    return NextResponse.json({ exito: true, datos: marca }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/marcas:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { exito: false, mensaje: 'Ya existe una marca con ese nombre' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { exito: false, mensaje: 'Error al crear la marca' },
      { status: 500 }
    )
  }
}

/** PUT /api/admin/marcas — editar marca */
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { id, nombre, descripcion, paisOrigen } = await request.json()

    if (!id || !nombre?.trim()) {
      return NextResponse.json(
        { exito: false, mensaje: 'id y nombre son obligatorios' },
        { status: 400 }
      )
    }

    const marca = await prisma.marca.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        paisOrigen: paisOrigen?.trim() || null,
      },
    })

    return NextResponse.json({ exito: true, datos: marca })
  } catch (error: any) {
    console.error('PUT /api/admin/marcas:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { exito: false, mensaje: 'Ya existe una marca con ese nombre' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { exito: false, mensaje: 'Error al actualizar la marca' },
      { status: 500 }
    )
  }
}

/** DELETE /api/admin/marcas?id=xxx — eliminar marca */
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { exito: false, mensaje: 'id es obligatorio' },
        { status: 400 }
      )
    }

    await prisma.marca.delete({ where: { id } })
    return NextResponse.json({ exito: true })
  } catch (error: any) {
    console.error('DELETE /api/admin/marcas:', error)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { exito: false, mensaje: 'No se puede eliminar: la marca tiene productos asociados' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { exito: false, mensaje: 'Error al eliminar la marca' },
      { status: 500 }
    )
  }
}
