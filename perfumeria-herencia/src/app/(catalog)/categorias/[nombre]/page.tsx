import { prisma } from '@/lib/prisma';
import { CatalogoCategoria } from '@/components/catalog/CatalogoCategoria';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { nombre: string };
}

function normalizarSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

async function getCategoriaBySlug(nombreSlug: string) {
  const categorias = await prisma.categoria.findMany({ where: { activa: true } });
  return categorias.find(c => normalizarSlug(c.nombre) === nombreSlug) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = await getCategoriaBySlug(params.nombre);
  if (!categoria) return { title: 'Categoría — HERENCIA' };
  return {
    title: `${categoria.nombre} — HERENCIA`,
    description: categoria.descripcion || `Fragancias de tipo ${categoria.nombre}`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const categoria = await getCategoriaBySlug(params.nombre);
  if (!categoria) notFound();

  return (
    <CatalogoCategoria
      categoriaId={categoria.id}
      categoriaNombre={categoria.nombre}
    />
  );
}
