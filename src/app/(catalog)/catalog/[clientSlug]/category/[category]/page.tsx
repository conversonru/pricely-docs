import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProductsByCategory, getCategories } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'

interface PageProps {
  params: Promise<{ clientSlug: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug, category } = await params
  const decodedCategory = decodeURIComponent(category)
  const client = await getClientBySlug(clientSlug)
  if (!client) return { title: 'Каталог не найден' }

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const canonicalUrl = `https://${clientSlug}.${domain}/category/${encodeURIComponent(decodedCategory)}`

  return {
    title: `${decodedCategory} — купить оптом | ${client.company_name}`,
    description: `Оптовые поставки: ${decodedCategory}. Актуальные цены и наличие. ${client.company_name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${decodedCategory} — ${client.company_name}`,
      description: `Оптовые поставки: ${decodedCategory}`,
      type: 'website',
      url: canonicalUrl,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { clientSlug, category } = await params
  const decodedCategory = decodeURIComponent(category)

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const [products, categories] = await Promise.all([
    getProductsByCategory(client.id, decodedCategory),
    getCategories(client.id),
  ])

  if (products.length === 0) notFound()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <ProductGrid
        products={products}
        clientSlug={clientSlug}
        categories={categories}
        activeCategory={decodedCategory}
      />
    </main>
  )
}
