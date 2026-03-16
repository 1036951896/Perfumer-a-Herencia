import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import CambiarEstadoPedido from '@/components/admin/CambiarEstadoPedido';

async function getPedidos() {
  const pedidos = await prisma.pedido.findMany({
    include: {
      items: {
        include: {
          producto: {
            include: {
              marca: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return pedidos;
}


export const metadata = {
  title: 'Gestión de Pedidos — HERENCIA',
};

export default async function PedidosAdmin() {
  const pedidos = await getPedidos();

  return (
    <div className="max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Pedidos</h1>
        <p className="text-sm text-gray-500">{pedidos.length} pedidos totales</p>
      </header>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PEDIDO</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">CLIENTE</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PRODUCTOS</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">ESTADO</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">TOTAL</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">FECHA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-gray-600">
                    #{pedido.id.slice(0, 8)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">{pedido.nombreCliente}</p>
                  <p className="text-xs text-gray-500">{pedido.emailCliente}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">
                    {pedido.items.length} {pedido.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pedido.items.map(item => item.producto.nombre).join(', ').substring(0, 50)}
                    {pedido.items.map(item => item.producto.nombre).join(', ').length > 50 ? '...' : ''}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <CambiarEstadoPedido pedidoId={pedido.id} estadoActual={pedido.estado} />
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  {formatCurrency(pedido.total)}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-500">
          No hay pedidos registrados
        </div>
      )}
    </div>
  );
}
