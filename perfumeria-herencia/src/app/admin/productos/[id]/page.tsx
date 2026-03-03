'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

interface Marca {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  segmento: string;
  concentracion: string;
  genero: string;
  volumen: string;
  marcaId: string;
  categoriaId: string;
}

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagenPreview, setImagenPreview] = useState('');

  useEffect(() => {
    // Cargar producto
    fetch(`/api/productos/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setImagenPreview(data.imagenUrl);
      });

    // Cargar marcas y categorías
    fetch('/api/marcas')
      .then(res => res.json())
      .then(data => setMarcas(data));
    
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: params.id,
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string),
      imagenUrl: formData.get('imagenUrl'),
      segmento: formData.get('segmento'),
      concentracion: formData.get('concentracion'),
      genero: formData.get('genero'),
      volumen: formData.get('volumen'),
      marcaId: formData.get('marcaId'),
      categoriaId: formData.get('categoriaId'),
    };

    try {
      const response = await fetch('/api/admin/productos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        router.push('/admin/productos');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/productos?id=${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/admin/productos');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  if (!producto) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Editar producto</h1>
          <p className="text-sm text-gray-500">{producto.nombre}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm text-red-600 hover:text-red-700 hover:underline"
        >
          Eliminar producto
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">INFORMACIÓN BÁSICA</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">NOMBRE</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    defaultValue={producto.nombre}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">MARCA</label>
                  <select
                    name="marcaId"
                    required
                    defaultValue={producto.marcaId}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    {marcas.map(marca => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">CATEGORÍA</label>
                  <select
                    name="categoriaId"
                    required
                    defaultValue={producto.categoriaId}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">SEGMENTO</label>
                  <select
                    name="segmento"
                    required
                    defaultValue={producto.segmento}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="ORIGINAL">Signature</option>
                    <option value="REPLICA">Inspired</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">CARACTERÍSTICAS</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">CONCENTRACIÓN</label>
                  <select
                    name="concentracion"
                    required
                    defaultValue={producto.concentracion}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="EAU_DE_PARFUM">Eau de Parfum</option>
                    <option value="EAU_DE_TOILETTE">Eau de Toilette</option>
                    <option value="EXTRAIT">Extrait de Parfum</option>
                    <option value="EAU_DE_COLOGNE">Eau de Cologne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">GÉNERO</label>
                  <select
                    name="genero"
                    required
                    defaultValue={producto.genero}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="UNISEX">Unisex</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">VOLUMEN</label>
                  <input
                    type="text"
                    name="volumen"
                    required
                    defaultValue={producto.volumen}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">DESCRIPCIÓN</h2>
              
              <textarea
                name="descripcion"
                required
                rows={8}
                defaultValue={producto.descripcion}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">IMAGEN</h2>
              
              <input
                type="url"
                name="imagenUrl"
                required
                defaultValue={producto.imagenUrl}
                onChange={(e) => setImagenPreview(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900 mb-3"
              />

              {imagenPreview && (
                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={imagenPreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">INVENTARIO Y PRECIO</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">PRECIO (€)</label>
                  <input
                    type="number"
                    name="precio"
                    required
                    step="0.01"
                    min="0"
                    defaultValue={producto.precio}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">STOCK</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    defaultValue={producto.stock}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors rounded disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
