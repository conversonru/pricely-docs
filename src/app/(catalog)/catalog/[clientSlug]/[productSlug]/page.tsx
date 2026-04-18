import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getClientBySlug, getProductBySlug, getManagerByToken } from '@/lib/catalog'
import { OrderButton } from '@/components/catalog/OrderButton'
import { SchemaOrg } from '@/components/catalog/SchemaOrg'

interface PageProps {
  params: Promise<{ clientSlug: string; productSlug: string }>
  searchParams: Promise<{ m?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug, productSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return {}
  const product = await getProductBySlug(client.id, productSlug)
  if (!product) return {}

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const canonicalUrl = `https://${clientSlug}.${domain}/${productSlug}`

  return {
    title: product.seo_title ?? `${product.name} — купить оптом | ${client.company_name}`,
    description:
      product.seo_description ??
      `${product.name} по цене ${product.price.toLocaleString('ru-RU')} ₽/${product.unit}. Оптовые поставки. ${client.company_name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.seo_title ?? product.name,
      description: product.seo_description ?? `${product.name} — ${client.company_name}`,
      images: product.image_url ? [{ url: product.image_url }] : [],
      type: 'website',
      url: canonicalUrl,
    },
  }
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { clientSlug, productSlug } = await params
  const { m: managerToken } = await searchParams

  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const [product, manager] = await Promise.all([
    getProductBySlug(client.id, productSlug),
    managerToken ? getManagerByToken(managerToken) : Promise.resolve(null),
  ])
  if (!product) notFound()

  const stockColor =
    product.stock === 'В наличии'
      ? 'text-green-600'
      : product.stock === 'Под заказ'
      ? 'text-yellow-600'
      : 'text-red-500'

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const pageUrl = `https://${clientSlug}.${domain}/${productSlug}`

  return (
    <>
      <SchemaOrg product={product} client={client} url={pageUrl} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 items-center flex-wrap">
          <Link href={`/catalog/${clientSlug}`} className="hover:text-gray-700">
            {client.company_name}
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Нет фото
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm text-gray-500">Арт. {product.sku}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-gray-500">/ {product.unit}</span>
            </div>

            <p className={`font-medium ${stockColor}`}>{product.stock}</p>

            <OrderButton client={client} product={product} manager={manager} />

            {product.description && (
              <div className="border-t pt-5">
                <h2 className="font-semibold text-gray-900 mb-2">Описание</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
