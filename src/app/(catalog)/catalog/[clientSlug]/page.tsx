import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProducts, getCategories } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'

interface PageProps {
  params: Promise<{ clientSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return { title: 'Каталог не найден' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const canonicalUrl = `https://${clientSlug}.${process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'}`

  return {
    title: `Каталог товаров — ${client.company_name}`,
    description: `Оптовый прайс-лист ${client.company_name}. Актуальные цены, наличие на складе. Заказ через MAX, Telegram, WhatsApp.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Каталог товаров — ${client.company_name}`,
      description: `Оптовый прайс-лист ${client.company_name}`,
      type: 'website',
      url: canonicalUrl,
    },
  }
}

export default async function CatalogPage({ params }: PageProps) {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const [products, categories] = await Promise.all([
    getProducts(client.id),
    getCategories(client.id),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <ProductGrid
        products={products}
        clientSlug={clientSlug}
        categories={categories}
      />
    </main>
  )
}
