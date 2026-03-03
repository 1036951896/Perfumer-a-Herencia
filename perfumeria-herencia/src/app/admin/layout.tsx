import Link from 'next/link';
import { redirect } from 'next/navigation';

// Verificación básica de autenticación (mejorar con NextAuth/middleware después)
function isAuthenticated() {
  // Por ahora siempre true - implementar autenticación real después
  return true;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) {
    redirect('/login');
  }

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
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button className="text-xs text-gray-500 hover:text-gray-700 tracking-wide">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
