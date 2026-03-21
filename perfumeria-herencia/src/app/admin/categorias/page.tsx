import { prisma } from '@/lib/prisma';
import { CategoriasManager } from '@/components/admin/CategoriasManager';

async function getCategorias() {
  return prisma.categoria.findMany({
    include: {
      _count: { select: { productos: true } },
    },
    orderBy: { nombre: 'asc' },
  });
}

export const metadata = {
  title: 'Gestión de Categorías — HERENCIA',
};

export default async function CategoriasAdmin() {
  const categorias = await getCategorias();
  return <CategoriasManager initialCategorias={categorias} />;
}
