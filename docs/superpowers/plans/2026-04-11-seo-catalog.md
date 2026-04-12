# SEO Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build SSR product catalog pages in Next.js that are fully indexed by Yandex/Google, with Schema.org markup and WhatsApp order button.

**Architecture:** Path-based multi-tenancy — `/catalog/[clientSlug]` for product list, `/catalog/[clientSlug]/[productSlug]` for product detail. All pages are Server Components (SSR) fetching from Supabase. Category filter is a Client Component hydrated on top. Schema.org Product markup is injected in `<head>` via `generateMetadata`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase JS client, Tailwind CSS v4, shadcn/ui (Card, Badge, Input, Select)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/catalog.ts` | Create | All Supabase data-fetching for catalog (getClient, getProducts, getProduct) |
| `src/app/(catalog)/catalog/[clientSlug]/page.tsx` | Create | Product list SSR page + generateMetadata |
| `src/app/(catalog)/catalog/[clientSlug]/[productSlug]/page.tsx` | Create | Product detail SSR page + Schema.org + generateMetadata |
| `src/components/catalog/ProductCard.tsx` | Create | Single product card (image, name, price, stock badge, link) |
| `src/components/catalog/ProductGrid.tsx` | Create | Grid layout + client-side category/price filters |
| `src/components/catalog/OrderButton.tsx` | Create | WhatsApp/Telegram order button with pre-filled message |
| `src/components/catalog/SchemaOrg.tsx` | Create | Injects JSON-LD Schema.org Product script tag |
| `src/app/(catalog)/layout.tsx` | Create | Minimal layout for catalog (no admin chrome) |

---

### Task 1: Data fetching layer

**Files:**
- Create: `src/lib/catalog.ts`

- [ ] **Step 1: Create the file with three typed fetch functions**

```typescript
// src/lib/catalog.ts
import { createClient } from '@/lib/supabase/server'
import type { Client, Product } from '@/types'

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('payment_status', 'active')
    .single()
  if (error) return null
  return data as Client
}

export async function getProducts(clientId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) return []
  return data as Product[]
}

export async function getProductBySlug(
  clientId: string,
  slug: string
): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data as Product
}

export function buildWhatsAppUrl(phone: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${text}`
}

export function buildTelegramUrl(username: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = username.replace('@', '')
  return `https://t.me/${clean}?text=${text}`
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
git add src/lib/catalog.ts
git commit -m "feat: add Supabase data-fetching layer for catalog"
```

---

### Task 2: Catalog layout

**Files:**
- Create: `src/app/(catalog)/layout.tsx`

- [ ] **Step 1: Create minimal catalog layout**

```typescript
// src/app/(catalog)/layout.tsx
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(catalog\)/layout.tsx
git commit -m "feat: add catalog route group layout"
```

---

### Task 3: ProductCard component

**Files:**
- Create: `src/components/catalog/ProductCard.tsx`

- [ ] **Step 1: Create ProductCard**

```typescript
// src/components/catalog/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  clientSlug: string
}

export function ProductCard({ product, clientSlug }: ProductCardProps) {
  const stockColor =
    product.stock === 'В наличии'
      ? 'bg-green-100 text-green-800'
      : product.stock === 'Под заказ'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'

  return (
    <Link href={`/catalog/${clientSlug}/${product.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 flex flex-col gap-3">
          {product.image_url ? (
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Нет фото
            </div>
          )}

          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xs text-gray-500">Арт. {product.sku}</p>
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-base">
              {product.price.toLocaleString('ru-RU')} ₽
              <span className="text-xs font-normal text-gray-500 ml-1">
                / {product.unit}
              </span>
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColor}`}>
              {product.stock}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/catalog/ProductCard.tsx
git commit -m "feat: add ProductCard component"
```

---

### Task 4: ProductGrid with filters

**Files:**
- Create: `src/components/catalog/ProductGrid.tsx`

- [ ] **Step 1: Create ProductGrid client component with category + search filters**

```typescript
// src/components/catalog/ProductGrid.tsx
'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  clientSlug: string
}

export function ProductGrid({ products, clientSlug }: ProductGridProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return unique.sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || p.category === category
      return matchSearch && matchCat
    })
  }, [products, search, category])

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Поиск по названию или артикулу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm bg-white"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        Показано {filtered.length} из {products.length} товаров
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить запрос или фильтр</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} clientSlug={clientSlug} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/catalog/ProductGrid.tsx
git commit -m "feat: add ProductGrid with search and category filters"
```

---

### Task 5: OrderButton component

**Files:**
- Create: `src/components/catalog/OrderButton.tsx`

- [ ] **Step 1: Create OrderButton**

```typescript
// src/components/catalog/OrderButton.tsx
import { buildWhatsAppUrl, buildTelegramUrl } from '@/lib/catalog'
import type { Client, Product } from '@/types'

interface OrderButtonProps {
  client: Client
  product: Product
}

export function OrderButton({ client, product }: OrderButtonProps) {
  const hasWhatsApp = Boolean(client.whatsapp)
  const hasTelegram = Boolean(client.telegram)

  if (!hasWhatsApp && !hasTelegram) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      {hasWhatsApp && (
        <a
          href={buildWhatsAppUrl(client.whatsapp!, product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Заказать в WhatsApp
        </a>
      )}
      {hasTelegram && (
        <a
          href={buildTelegramUrl(client.telegram!, product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Заказать в Telegram
        </a>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/catalog/OrderButton.tsx
git commit -m "feat: add OrderButton with WhatsApp and Telegram links"
```

---

### Task 6: Schema.org component

**Files:**
- Create: `src/components/catalog/SchemaOrg.tsx`

- [ ] **Step 1: Create SchemaOrg JSON-LD component**

```typescript
// src/components/catalog/SchemaOrg.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/catalog/SchemaOrg.tsx
git commit -m "feat: add Schema.org Product JSON-LD component"
```

---

### Task 7: Product list page (SSR)

**Files:**
- Create: `src/app/(catalog)/catalog/[clientSlug]/page.tsx`

- [ ] **Step 1: Create the SSR product list page with generateMetadata**

```typescript
// src/app/(catalog)/catalog/[clientSlug]/page.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(catalog\)/catalog/
git commit -m "feat: add SSR product list page with SEO metadata"
```

---

### Task 8: Product detail page (SSR + Schema.org)

**Files:**
- Create: `src/app/(catalog)/catalog/[clientSlug]/[productSlug]/page.tsx`

- [ ] **Step 1: Create the SSR product detail page**

```typescript
// src/app/(catalog)/catalog/[clientSlug]/[productSlug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getClientBySlug, getProductBySlug } from '@/lib/catalog'
import { OrderButton } from '@/components/catalog/OrderButton'
import { SchemaOrg } from '@/components/catalog/SchemaOrg'

interface PageProps {
  params: Promise<{ clientSlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug, productSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) return {}
  const product = await getProductBySlug(client.id, productSlug)
  if (!product) return {}

  return {
    title: product.seo_title ?? `${product.name} — купить оптом | ${client.company_name}`,
    description:
      product.seo_description ??
      `${product.name} по цене ${product.price.toLocaleString('ru-RU')} ₽/${product.unit}. Оптовые поставки. ${client.company_name}.`,
    openGraph: {
      title: product.seo_title ?? product.name,
      images: product.image_url ? [{ url: product.image_url }] : [],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { clientSlug, productSlug } = await params
  const client = await getClientBySlug(clientSlug)
  if (!client) notFound()

  const product = await getProductBySlug(client.id, productSlug)
  if (!product) notFound()

  const stockColor =
    product.stock === 'В наличии'
      ? 'text-green-600'
      : product.stock === 'Под заказ'
      ? 'text-yellow-600'
      : 'text-red-500'

  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/catalog/${clientSlug}/${productSlug}`

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

            <OrderButton client={client} product={product} />

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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(catalog\)/catalog/\[clientSlug\]/\[productSlug\]/
git commit -m "feat: add SSR product detail page with Schema.org and order button"
```

---

### Task 9: Fix next.config.ts for external images

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Allow external image domains in Next.js**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: allow external images in Next.js config"
```

---

### Task 10: Run dev server and verify

- [ ] **Step 1: Start dev server**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
npm run dev
```

- [ ] **Step 2: Open catalog in browser**

Open: `http://localhost:3000/catalog/demo`

Expected:
- Page loads with "Демо-каталог Pricely"
- 25 products visible as cards
- Category filter buttons work
- Search input filters products

- [ ] **Step 3: Open product detail page**

Open: `http://localhost:3000/catalog/demo/vtulka-rezinovaya-50h30`

Expected:
- Product name as H1
- Price, SKU, stock status visible
- WhatsApp / Telegram order button present
- `<script type="application/ld+json">` in page source with Schema.org Product data

- [ ] **Step 4: Verify SSR (Yandex-bot simulation)**

```bash
curl -s http://localhost:3000/catalog/demo | grep -E '<h1|<title|vtulka'
```

Expected output contains H1 and product links — page is fully rendered server-side.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Day 3 complete — SSR product catalog with Schema.org and filters"
```
