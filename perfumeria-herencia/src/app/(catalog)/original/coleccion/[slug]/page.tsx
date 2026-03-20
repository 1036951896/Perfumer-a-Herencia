import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogoPorSegmento } from '@/components/catalog/CatalogoPorSegmento'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/colecciones?segmento=ORIGINAL`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    const col = (data.datos || []).find((c: any) => c.slug === params.slug)

    return {
      title: col?.seoTitle ?? col?.nombre ?? 'Colección — HERENCIA',
      description: col?.seoDescription ?? col?.descripcion ?? undefined,
      openGraph: col?.bannerUrl ? { images: [col.bannerUrl] } : undefined,
    }
  } catch {
    return { title: 'Colección — HERENCIA' }
  }
}

export default function ColeccionPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <CatalogoPorSegmento
        segment="original"
        coleccionSlug={params.slug}
      />
    </Suspense>
  )
}
