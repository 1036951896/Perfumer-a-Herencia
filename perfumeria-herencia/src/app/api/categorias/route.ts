import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: { _count: { select: { productos: true } } },
    });
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const categoria = await prisma.categoria.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || ''
      }
    });
    return NextResponse.json(categoria);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
