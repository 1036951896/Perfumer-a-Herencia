import { ProductoDetalle } from '@/components/catalog/ProductoDetalle'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detalle del Producto - Herencia Perfumería',
}

interface PropsPage {
  params: {
    id: string
  }
}

export default function ProductoPage({ params }: PropsPage) {
  return <ProductoDetalle productoId={params.id} segment="original" />
}
