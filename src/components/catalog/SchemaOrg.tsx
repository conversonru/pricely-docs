import type { Product, Client } from '@/types'

interface SchemaOrgProps {
  product: Product
  client: Client
  url: string
}

export function SchemaOrg({ product, client, url }: SchemaOrgProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? product.name,
    sku: product.sku,
    image: product.image_url ?? undefined,
    url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.stock === 'В наличии'
          ? 'https://schema.org/InStock'
          : product.stock === 'Под заказ'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: client.company_name,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
