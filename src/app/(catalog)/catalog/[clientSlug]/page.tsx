import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProducts, getCategories, getManagerByToken } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { ManagerBanner } from '@/components/catalog/ManagerBanner'

interface PageProps {
  params: Promise<{ clientSlug: string }>
  searchParams: Promise<{ m?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return { title: 'Каталог не найден' }

  const canonicalUrl = `https://${clientSlug}.${process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'}`

  return {
    title: `Каталог товаров — ${client.company_name}`,
    description: `Оптовый прайс-лист ${client.company_name}. Актуальные цены, наличие на складе. Заказ через MAX, Telegram, WhatsApp.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Каталог товаров — ${client.company_name}`,
      description: `Оптовый прайс-лист ${client.company_name}`,
      type: 'website',
      url: canonicalUrl,
    },
  }
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { clientSlug } = await params
  const { m: managerToken } = await searchParams

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const [products, categories, manager] = await Promise.all([
    getProducts(client.id),
    getCategories(client.id),
    managerToken ? getManagerByToken(managerToken) : Promise.resolve(null),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {manager && <ManagerBanner manager={manager} />}
      <ProductGrid
        products={products}
        clientSlug={clientSlug}
        categories={categories}
        manager={manager}
      />
    </main>
  )
}
