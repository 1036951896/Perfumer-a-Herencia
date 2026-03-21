import { prisma } from '@/lib/prisma';
import { MarcasManager } from '@/components/admin/MarcasManager';

async function getMarcas() {
  const marcas = await prisma.marca.findMany({
    include: {
      _count: {
        select: { productos: true }
      }
    },
    orderBy: { nombre: 'asc' }
  });

  return marcas;
}

export const metadata = {
  title: 'Gestión de Marcas — HERENCIA',
};

export default async function MarcasAdmin() {
  const marcas = await getMarcas();
  return <MarcasManager initialMarcas={marcas} />;
}
