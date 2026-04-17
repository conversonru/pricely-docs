import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProductsByCategory, getCategories, getCategoryBySlug } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { slugify } from '@/lib/slugify'

interface PageProps {
  params: Promise<{ clientSlug: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug, category: categorySlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return { title: 'Каталог не найден' }

  const categoryName = await getCategoryBySlug(client.id, categorySlug)
  if (!categoryName) return { title: 'Категория не найдена' }

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const canonicalUrl = `https://${clientSlug}.${domain}/category/${slugify(categoryName)}`

  return {
    title: `${categoryName} — купить оптом | ${client.company_name}`,
    description: `Оптовые поставки: ${categoryName}. Актуальные цены и наличие. ${client.company_name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryName} — ${client.company_name}`,
      description: `Оптовые поставки: ${categoryName}`,
      type: 'website',
      url: canonicalUrl,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { clientSlug, category: categorySlug } = await params

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const categoryName = await getCategoryBySlug(client.id, categorySlug)
  if (!categoryName) notFound()

  const [products, categories] = await Promise.all([
    getProductsByCategory(client.id, categoryName),
    getCategories(client.id),
  ])

  if (products.length === 0) notFound()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <ProductGrid
        products={products}
        clientSlug={clientSlug}
        categories={categories}
        activeCategory={categoryName}
      />
    </main>
  )
}
