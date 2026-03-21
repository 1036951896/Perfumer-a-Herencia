'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Marca {
  id: string;
  nombre: string;
  descripcion: string | null;
  paisOrigen: string | null;
  _count: { productos: number };
}

function MarcaModal({
  marca,
  onClose,
  onSave,
}: {
  marca: Partial<Marca> | null;
  onClose: () => void;
  onSave: (data: { id?: string; nombre: string; descripcion: string; paisOrigen: string }) => Promise<void>;
}) {
  const [nombre, setNombre] = useState(marca?.nombre || '');
  const [descripcion, setDescripcion] = useState(marca?.descripcion || '');
  const [paisOrigen, setPaisOrigen] = useState(marca?.paisOrigen || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave({ id: marca?.id, nombre, descripcion, paisOrigen });
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-900">
            {marca?.id ? 'Editar marca' : 'Nueva marca'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">NOMBRE *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              placeholder="Ej: Jean Paul Gaultier"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">DESCRIPCIÓN</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              placeholder="Breve descripción de la casa perfumística"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">PAÍS DE ORIGEN</label>
            <input
              type="text"
              value={paisOrigen}
              onChange={(e) => setPaisOrigen(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              placeholder="Ej: Francia"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:border-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MarcasManager({ initialMarcas }: { initialMarcas: Marca[] }) {
  const router = useRouter();
  const [marcas, setMarcas] = useState<Marca[]>(initialMarcas);
  const [modal, setModal] = useState<{ open: boolean; marca: Partial<Marca> | null }>({
    open: false,
    marca: null,
  });

  const openCrear = () => setModal({ open: true, marca: null });
  const openEditar = (marca: Marca) => setModal({ open: true, marca });
  const closeModal = () => setModal({ open: false, marca: null });

  const handleSave = async (data: { id?: string; nombre: string; descripcion: string; paisOrigen: string }) => {
    const isEdit = !!data.id;
    const res = await fetch('/api/admin/marcas', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.exito) throw new Error(json.mensaje);

    closeModal();
    router.refresh();

    if (isEdit) {
      setMarcas(prev =>
        prev.map(m => m.id === data.id ? { ...m, ...json.datos } : m)
      );
    } else {
      setMarcas(prev => [...prev, { ...json.datos, _count: { productos: 0 } }]);
    }
  };

  const handleDelete = async (marca: Marca) => {
    if (marca._count.productos > 0) {
      alert(`No se puede eliminar "${marca.nombre}": tiene ${marca._count.productos} producto(s) asociado(s).`);
      return;
    }
    if (!confirm(`¿Eliminar la marca "${marca.nombre}"? Esta acción no se puede deshacer.`)) return;

    const res = await fetch(`/api/admin/marcas?id=${marca.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.exito) {
      alert(json.mensaje || 'Error al eliminar');
      return;
    }
    setMarcas(prev => prev.filter(m => m.id !== marca.id));
  };

  return (
    <div className="max-w-6xl">
      {modal.open && (
        <MarcaModal
          marca={modal.marca}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Marcas</h1>
          <p className="text-sm text-gray-500">{marcas.length} marcas en catálogo</p>
        </div>
        <button
          onClick={openCrear}
          className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors rounded"
        >
          Añadir marca
        </button>
      </header>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">MARCA</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">DESCRIPCIÓN</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PAÍS</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">PRODUCTOS</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 tracking-wide text-xs">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marcas.map((marca) => (
                <tr key={marca.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{marca.nombre}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{marca.descripcion || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">{marca.paisOrigen || '—'}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{marca._count.productos}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEditar(marca)}
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(marca)}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {marcas.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                    No hay marcas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
