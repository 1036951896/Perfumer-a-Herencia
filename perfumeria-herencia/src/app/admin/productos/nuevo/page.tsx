'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Marca {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
}

export default function NuevoProducto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagen1Url, setImagen1Url] = useState('');
  const [imagen2Url, setImagen2Url] = useState('');
  const [subiendo1, setSubiendo1] = useState(false);
  const [subiendo2, setSubiendo2] = useState(false);

  // Validaciones educativas
  const [validaciones, setValidaciones] = useState({
    imagenCalidad: false,
    descripcionEducativa: false,
    precioCoherente: false
  });

  useEffect(() => {
    // Cargar marcas y categorías
    fetch('/api/marcas')
      .then(res => res.json())
      .then(data => setMarcas(data.datos || data));
    
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data.datos || data));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string),
      imagenUrl: [imagen1Url, imagen2Url].filter(Boolean).join('|'),
      segmento: formData.get('segmento'),
      concentracion: formData.get('concentracion'),
      genero: formData.get('genero'),
      volumen: formData.get('volumen'),
      marcaId: formData.get('marcaId'),
      categoriaId: formData.get('categoriaId'),
    };

    try {
      const response = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        router.push('/admin/productos');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubirImagen = async (file: File | null, numero: 1 | 2) => {
    if (!file) return
    numero === 1 ? setSubiendo1(true) : setSubiendo2(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) numero === 1 ? setImagen1Url(json.url) : setImagen2Url(json.url)
      else alert(json.error || 'Error al subir la imagen')
    } catch {
      alert('Error al subir la imagen')
    } finally {
      numero === 1 ? setSubiendo1(false) : setSubiendo2(false)
    }
  }

  const validarDescripcion = (texto: string) => {
    // Descripción educativa debe tener al menos 100 caracteres y mencionar notas
    const esEducativa = texto.length >= 100 && 
      (texto.toLowerCase().includes('nota') || 
       texto.toLowerCase().includes('acorde') ||
       texto.toLowerCase().includes('familia'));
    setValidaciones(prev => ({ ...prev, descripcionEducativa: esEducativa }));
  };

  const validarPrecio = (precio: number, segmento: string) => {
    // Signature debe ser > 80€, Inspired entre 25-60€
    const esCoherente = segmento === 'ORIGINAL' 
      ? precio >= 80 
      : precio >= 25 && precio <= 60;
    setValidaciones(prev => ({ ...prev, precioCoherente: esCoherente }));
  };

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Nuevo producto</h1>
        <p className="text-sm text-gray-500">Añadir una fragancia al catálogo</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grid de 2 columnas - operacional y eficiente */}
        <div className="grid grid-cols-2 gap-8">
          {/* Columna izquierda - Información básica */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                    placeholder="Ej: Aventus"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">MARCA</label>
                  <select
                    name="marcaId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Seleccionar marca</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Seleccionar categoría</option>
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
                    onChange={(e) => {
                      const precio = parseFloat((document.querySelector('[name="precio"]') as HTMLInputElement)?.value || '0');
                      validarPrecio(precio, e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Seleccionar segmento</option>
                    <option value="ORIGINAL">Signature (originales de casa)</option>
                    <option value="REPLICA">Inspired (interpretaciones)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Signature son creaciones propias, Inspired son interpretaciones de fragancias icónicas
                  </p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Seleccionar</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Seleccionar</option>
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
                    placeholder="100ml"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Descripción, imagen, precio */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">DESCRIPCIÓN</h2>
              
              <textarea
                name="descripcion"
                required
                rows={8}
                onChange={(e) => validarDescripcion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                placeholder="Describe las notas olfativas, la familia aromática y el carácter de la fragancia. Educa al cliente sobre la composición, no solo vendas."
              />
              
              {validaciones.descripcionEducativa ? (
                <p className="text-xs text-green-600 mt-2">✓ Descripción educativa y detallada</p>
              ) : (
                <p className="text-xs text-amber-600 mt-2">⚠ Incluye información sobre notas, acordes o familia olfativa (mín. 100 caracteres)</p>
              )}
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">IMÁGENES</h2>

              {/* Imagen 1 — Catálogo */}
              <div className="mb-6">
                <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">IMAGEN 1 — CATÁLOGO</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imagen1Url}
                    onChange={(e) => setImagen1Url(e.target.value)}
                    placeholder="/productos/nombre.webp"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                  <label className="cursor-pointer px-3 py-2 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap flex items-center">
                    {subiendo1 ? 'Subiendo…' : '↑ Subir foto'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirImagen(e.target.files?.[0] ?? null, 1)} />
                  </label>
                </div>
                {imagen1Url && (
                  <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                    <Image src={imagen1Url} alt="Imagen 1" fill className="object-contain" unoptimized />
                  </div>
                )}
              </div>

              {/* Imagen 2 — Detalle */}
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">IMAGEN 2 — DETALLE</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imagen2Url}
                    onChange={(e) => setImagen2Url(e.target.value)}
                    placeholder="/productos/nombre2.webp"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                  <label className="cursor-pointer px-3 py-2 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap flex items-center">
                    {subiendo2 ? 'Subiendo…' : '↑ Subir foto'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSubirImagen(e.target.files?.[0] ?? null, 2)} />
                  </label>
                </div>
                {imagen2Url && (
                  <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                    <Image src={imagen2Url} alt="Imagen 2" fill className="object-contain" unoptimized />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Aparece en la página de detalle junto a la descripción</p>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded">
              <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-wide">INVENTARIO Y PRECIO</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">PRECIO ($)</label>
                  <input
                    type="number"
                    name="precio"
                    required
                    step="0.01"
                    min="0"
                    onChange={(e) => {
                      const segmento = (document.querySelector('[name="segmento"]') as HTMLSelectElement)?.value;
                      validarPrecio(parseFloat(e.target.value), segmento);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                  {validaciones.precioCoherente ? (
                    <p className="text-xs text-green-600 mt-1.5">✓ Precio coherente con el segmento</p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-1.5">⚠ Signature ≥80€, Inspired 25-60€</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 tracking-wide">STOCK INICIAL</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
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
            disabled={loading || !imagen1Url || !validaciones.descripcionEducativa || !validaciones.precioCoherente}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
