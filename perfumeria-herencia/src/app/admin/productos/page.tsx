import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

async function getProductos() {
  const productos = await prisma.producto.findMany({
    include: {
      marca: true,
      categoria: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return productos;
}

export const metadata = {
  title: 'Gestión de Productos — HERENCIA',
};

export default async function ProductosAdmin() {
  const productos = await getProductos();

  return (
    <div className="max-w-7xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Productos</h1>
          <p className="text-sm text-gray-500">{productos.length} productos en catálogo</p>
        </div>
        <Link 
          href="/admin/productos/nuevo"
          className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors rounded"
        >
          Añadir producto
        </Link>
      </header>

      {/* Tabla operacional - alineada, clara, sin decoración excesiva */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PRODUCTO</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">MARCA</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">CATEGORÍA</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">SEGMENTO</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PRECIO</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">STOCK</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={producto.imagenUrl?.includes('|') ? producto.imagenUrl.split('|')[0].trim() : (producto.imagenUrl || '')}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-500">{producto.concentracion}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">{producto.marca.nombre}</td>
                <td className="py-3 px-4 text-gray-700">{producto.categoria.nombre}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    producto.segmento === 'ORIGINAL' 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {producto.segmento === 'ORIGINAL' ? 'Signature' : 'Inspired'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  {formatCurrency(producto.precio)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${
                    producto.stock < 10 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {producto.stock}
                  </span>
                  {producto.stock < 10 && (
                    <span className="text-xs text-red-600 ml-2">Bajo</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <Link 
                    href={`/admin/productos/${producto.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Guía educativa - sin interferir, solo informar */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded">
        <p className="text-xs text-blue-900 mb-2 font-medium tracking-wide">COHERENCIA DE MARCA</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Las imágenes deben ser de alta calidad (mínimo 800x800px)</li>
          <li>• Las descripciones deben educar sobre las notas olfativas, no solo vender</li>
          <li>• El tono debe ser aspiracional pero honesto, nunca promocional</li>
          <li>• Segmento &quot;Signature&quot; son fragancias originales de casa, &quot;Inspired&quot; son interpretaciones</li>
        </ul>
      </div>
    </div>
  );
}
