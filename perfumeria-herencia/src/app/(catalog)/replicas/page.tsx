import { CatalogoPorSegmento } from '@/components/catalog/CatalogoPorSegmento'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colección Inspired — HERENCIA',
  description: 'Interpretaciones inspiradas en fragancias clásicas. Selección curada de alta calidad con elegancia atemporal.',
}

export default function ReplicasPage() {
  return <CatalogoPorSegmento segment="replicas" />
}
