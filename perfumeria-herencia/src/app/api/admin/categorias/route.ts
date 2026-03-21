import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { nombre, descripcion } = await request.json();
    if (!nombre?.trim()) {
      return NextResponse.json({ exito: false, mensaje: 'El nombre es obligatorio' }, { status: 400 });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
      },
      include: { _count: { select: { productos: true } } },
    });

    return NextResponse.json({ exito: true, datos: categoria }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ exito: false, mensaje: 'Ya existe una categoría con ese nombre' }, { status: 409 });
    }
    console.error('POST /api/admin/categorias:', error);
    return NextResponse.json({ exito: false, mensaje: 'Error al crear categoría' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id, nombre, descripcion } = await request.json();
    if (!id) return NextResponse.json({ exito: false, mensaje: 'ID requerido' }, { status: 400 });
    if (!nombre?.trim()) return NextResponse.json({ exito: false, mensaje: 'El nombre es obligatorio' }, { status: 400 });

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
      },
      include: { _count: { select: { productos: true } } },
    });

    return NextResponse.json({ exito: true, datos: categoria });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ exito: false, mensaje: 'Ya existe una categoría con ese nombre' }, { status: 409 });
    }
    console.error('PUT /api/admin/categorias:', error);
    return NextResponse.json({ exito: false, mensaje: 'Error al actualizar categoría' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ exito: false, mensaje: 'ID requerido' }, { status: 400 });

    await prisma.categoria.delete({ where: { id } });
    return NextResponse.json({ exito: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json(
        { exito: false, mensaje: 'No se puede eliminar: tiene productos asignados' },
        { status: 409 }
      );
    }
    console.error('DELETE /api/admin/categorias:', error);
    return NextResponse.json({ exito: false, mensaje: 'Error al eliminar categoría' }, { status: 500 });
  }
}
