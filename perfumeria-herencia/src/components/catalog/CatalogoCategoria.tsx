'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Paginacion } from '@/components/catalog/Paginacion';

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  segmento: string;
  imagenUrl: string;
  precio?: number;
  destacado: boolean;
  activo: boolean;
  marca?: { nombre: string };
  createdAt: Date;
}

interface CatalogoCategoriaProps {
  categoriaId: string;
  categoriaNombre: string;
}

export function CatalogoCategoria({ categoriaId, categoriaNombre }: CatalogoCategoriaProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          categoriaId,
          pagina: pagina.toString(),
          limite: '12',
        });
        const res = await fetch(`/api/productos?${params}`);
        const data = await res.json();
        setProductos(data.datos || []);
        setTotalPaginas(data.totalPaginas || 1);
      } catch {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [categoriaId, pagina]);

  const segment = (p: Producto) =>
    p.segmento === 'ORIGINAL' ? 'original' : 'replicas';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center py-16 mb-8">
          <p className="text-[10px] tracking-[0.35em] uppercase text-dark/35 mb-4">Colección</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-dark mb-6">
            {categoriaNombre}
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto" />
        </div>

        {/* Volver */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase text-dark/40 hover:text-dark border-b border-dark/20 pb-0.5 transition-colors"
          >
            ← Inicio
          </Link>
        </div>

        {/* Productos */}
        {loading && productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/30 text-xs tracking-[0.3em] uppercase">Cargando colección...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark/40 text-base font-light">
              No hay fragancias en esta categoría aún.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-10 mb-24">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto as any}
                  segment={segment(producto)}
                />
              ))}
            </div>
            <Paginacion
              pagina={pagina}
              totalPaginas={totalPaginas}
              onPaginaChange={setPagina}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}
