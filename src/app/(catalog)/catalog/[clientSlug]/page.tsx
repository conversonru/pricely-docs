import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getClientBySlug, getProducts } from '@/lib/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'

interface PageProps {
  params: Promise<{ clientSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return { title: 'Каталог не найден' }

  return {
    title: `Каталог товаров — ${client.company_name}`,
    description: `Оптовый прайс-лист ${client.company_name}. Актуальные цены, наличие на складе, заказ через WhatsApp.`,
    openGraph: {
      title: `Каталог товаров — ${client.company_name}`,
      type: 'website',
    },
  }
}

export default async function CatalogPage({ params }: PageProps) {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const products = await getProducts(client.id)

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{client.company_name}</h1>
        <p className="text-gray-500 mt-1">
          {products.length} товаров · Оптовые поставки
        </p>
        <div className="flex gap-4 mt-3">
          {client.whatsapp && (
            <a
              href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              WhatsApp
            </a>
          )}
          {client.telegram && (
            <a
              href={`https://t.me/${client.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Telegram
            </a>
          )}
        </div>
      </div>

      {/* Product grid with filters */}
      <ProductGrid products={products} clientSlug={clientSlug} />
    </main>
  )
}
