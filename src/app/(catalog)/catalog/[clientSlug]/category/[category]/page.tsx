import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProductsByCategory, getCategories, getCategoryBySlug, getManagerByToken } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { ManagerBanner } from '@/components/catalog/ManagerBanner'
import { slugify } from '@/lib/slugify'

interface PageProps {
  params: Promise<{ clientSlug: string; category: string }>
  searchParams: Promise<{ m?: string }>
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { clientSlug, category: categorySlug } = await params
  const { m: managerToken } = await searchParams

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const categoryName = await getCategoryBySlug(client.id, categorySlug)
  if (!categoryName) notFound()

  const [products, categories, manager] = await Promise.all([
    getProductsByCategory(client.id, categoryName),
    getCategories(client.id),
    managerToken ? getManagerByToken(managerToken) : Promise.resolve(null),
  ])

  if (products.length === 0) notFound()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {manager && <ManagerBanner manager={manager} />}
      <ProductGrid
        products={products}
        clientSlug={clientSlug}
        categories={categories}
        activeCategory={categoryName}
        manager={manager}
      />
    </main>
  )
}
