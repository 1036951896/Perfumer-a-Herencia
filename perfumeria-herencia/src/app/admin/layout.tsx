import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
      {/* Sidebar - Operacional, no decorativo */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-medium text-gray-900">HERENCIA</h1>
          <p className="text-xs text-gray-500 mt-1 tracking-wide">Panel Operacional</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin" 
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Resumen
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/productos" 
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/pedidos" 
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Pedidos
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/marcas" 
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Marcas
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/colecciones" 
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Colecciones
              </Link>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase px-4 mb-2">Cuenta</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/cuenta"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Cambiar contraseña
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content area */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
