import { CatalogoPorSegmento } from '@/components/catalog/CatalogoPorSegmento'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colección Signature — HERENCIA',
  description: 'Fragancias certificadas de autor. Selección curada de perfumes originales que definen carácter y presencia.',
}

export default function OriginalPage() {
  return <CatalogoPorSegmento segment="original" />
}
