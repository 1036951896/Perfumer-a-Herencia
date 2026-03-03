import { CarritoCompras } from '@/components/catalog/CarritoCompras'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito de Compras - Herencia Perfumería',
}

export default function CarritoPage() {
  return <CarritoCompras segment="original" />
}
