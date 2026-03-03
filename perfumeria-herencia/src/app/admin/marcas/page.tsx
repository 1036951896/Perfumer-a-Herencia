import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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

  return (
    <div className="max-w-6xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Marcas</h1>
          <p className="text-sm text-gray-500">{marcas.length} marcas en catálogo</p>
        </div>
      </header>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">MARCA</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">DESCRIPCIÓN</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PAÍS</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PRODUCTOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {marcas.map((marca) => (
              <tr key={marca.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{marca.nombre}</td>
                <td className="py-3 px-4 text-gray-700">{marca.descripcion || '—'}</td>
                <td className="py-3 px-4 text-gray-700">{marca.paisOrigen || '—'}</td>
                <td className="py-3 px-4 text-right text-gray-900">{marca._count.productos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
