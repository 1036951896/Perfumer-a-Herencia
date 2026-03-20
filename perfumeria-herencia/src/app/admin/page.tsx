import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Pedidos de hoy
  const pedidosHoy = await prisma.pedido.count({
    where: {
      createdAt: { gte: today }
    }
  });

  // Ventas totales hoy
  const ventasHoy = await prisma.pedido.aggregate({
    where: {
      createdAt: { gte: today },
      estado: { not: 'CANCELADO' }
    },
    _sum: { total: true }
  });

  // Pedidos pendientes (PENDIENTE o EN_PROCESO)
  const pedidosPendientes = await prisma.pedido.count({
    where: {
      estado: { in: ['PENDIENTE', 'EN_PROCESO'] }
    }
  });

  // Productos con stock bajo (< 10)
  const productosBajoStock = await prisma.producto.count({
    where: {
      stock: { lt: 10 }
    }
  });

  // Total de productos
  const totalProductos = await prisma.producto.count();

  return {
    pedidosHoy,
    ventasHoy: ventasHoy._sum.total || 0,
    pedidosPendientes,
    productosBajoStock,
    totalProductos
  };
}

export const metadata = {
  title: 'Panel Operacional — HERENCIA',
  description: 'Panel de administración'
};

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Resumen operacional</h1>
        <p className="text-sm text-gray-500">Vista general del estado actual</p>
      </header>

      {/* Métricas esenciales - sin decoración */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-200 rounded">
          <p className="text-xs text-gray-500 tracking-wide mb-2">PEDIDOS HOY</p>
          <p className="text-3xl font-medium text-gray-900">{data.pedidosHoy}</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded">
          <p className="text-xs text-gray-500 tracking-wide mb-2">VENTAS HOY</p>
          <p className="text-3xl font-medium text-gray-900">{formatCurrency(data.ventasHoy)}</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded">
          <p className="text-xs text-gray-500 tracking-wide mb-2">PENDIENTES</p>
          <p className="text-3xl font-medium text-gray-900">{data.pedidosPendientes}</p>
          {data.pedidosPendientes > 0 && (
            <p className="text-xs text-amber-600 mt-2">Requieren atención</p>
          )}
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded">
          <p className="text-xs text-gray-500 tracking-wide mb-2">STOCK BAJO</p>
          <p className="text-3xl font-medium text-gray-900">{data.productosBajoStock}</p>
          {data.productosBajoStock > 0 && (
            <p className="text-xs text-red-600 mt-2">Reabastecer pronto</p>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 border border-gray-200 rounded">
        <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">ACCIONES RÁPIDAS</h2>
        <div className="space-y-3">
          <a 
            href="/admin/productos/nuevo" 
            className="block text-sm text-gray-700 hover:text-gray-900 hover:underline"
          >
            → Añadir nuevo producto
          </a>
          <a 
            href="/admin/pedidos?estado=PENDIENTE" 
            className="block text-sm text-gray-700 hover:text-gray-900 hover:underline"
          >
            → Ver pedidos pendientes
          </a>
          <a 
            href="/admin/productos?stock=bajo" 
            className="block text-sm text-gray-700 hover:text-gray-900 hover:underline"
          >
            → Revisar stock bajo
          </a>
        </div>
      </div>
    </div>
  );
}
