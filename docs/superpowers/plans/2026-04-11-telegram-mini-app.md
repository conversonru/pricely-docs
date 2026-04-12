# Telegram Mini App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать Telegram Mini App — каталог товаров, который открывается прямо внутри Telegram с нативной навигацией, темой и кнопками заказа.

**Architecture:** Отдельный route group `(tma)` с маршрутами `/tma/[clientSlug]` (список) и `/tma/[clientSlug]/[productSlug]` (карточка). Все страницы — Client Components (`'use client'`), потому что TMA SDK работает только в браузере. Данные берутся через Supabase browser client. SDK инициализируется один раз в layout через `TMAInit` компонент. Деградирует gracefully вне Telegram (dev в браузере работает).

**Tech Stack:** `@tma.js/sdk` v3, `@tma.js/sdk-react` v3, Next.js 16 App Router, Supabase browser client (`@supabase/ssr`), Tailwind CSS v4

---

## File Map

| Файл | Действие | Ответственность |
|------|----------|----------------|
| `src/lib/catalog-client.ts` | Создать | Supabase browser client: getClientBySlug, getProducts, getProductBySlug, buildWhatsAppUrl, buildTelegramUrl |
| `src/components/tma/TMAInit.tsx` | Создать | `'use client'`: init SDK, expand viewport, bindCssVars темы |
| `src/components/tma/TMABackButton.tsx` | Создать | `'use client'`: показывает Telegram Back Button, по клику — router.back() |
| `src/components/tma/TMAOrderButton.tsx` | Создать | `'use client'`: кнопки заказа через openLink/openTelegramLink |
| `src/app/(tma)/layout.tsx` | Создать | TMA layout: Telegram script в head + TMAInit |
| `src/app/(tma)/tma/[clientSlug]/page.tsx` | Создать | `'use client'`: список товаров с поиском и фильтрами |
| `src/app/(tma)/tma/[clientSlug]/[productSlug]/page.tsx` | Создать | `'use client'`: карточка товара + TMABackButton + TMAOrderButton |

---

### Task 1: Установка зависимостей

**Files:**
- Modify: `package.json` (через npm install)

- [ ] **Step 1: Установить @tma.js/sdk и @tma.js/sdk-react**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
npm install @tma.js/sdk @tma.js/sdk-react
```

Ожидаемый вывод: `added N packages` без ошибок.

- [ ] **Step 2: Проверить установку**

```bash
node -e "require('@tma.js/sdk'); console.log('ok')"
```

Ожидаемый вывод: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @tma.js/sdk and @tma.js/sdk-react"
```

---

### Task 2: Browser client для данных каталога

**Files:**
- Create: `src/lib/catalog-client.ts`

Эта библиотека — зеркало `catalog.ts`, но использует browser Supabase client (не server), поэтому может вызываться из Client Components TMA-страниц. Нет `import 'server-only'`.

- [ ] **Step 1: Создать файл**

```typescript
// src/lib/catalog-client.ts
import { createClient } from '@/lib/supabase/client'
import type { Client, Product } from '@/types'

export async function getClientBySlugClient(slug: string): Promise<Client | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('payment_status', 'active')
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog-client] getClientBySlug:', error.message)
    return null
  }
  return data as Client
}

export async function getProductsClient(clientId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('[catalog-client] getProducts:', error.message)
    return []
  }
  return data as Product[]
}

export async function getProductBySlugClient(
  clientId: string,
  slug: string
): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog-client] getProductBySlug:', error.message)
    return null
  }
  return data as Product
}

export function buildWhatsAppUrl(phone: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${text}`
}

export function buildTelegramUrl(username: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = username.replace(/^@/, '')
  return `https://t.me/${clean}?text=${text}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/catalog-client.ts
git commit -m "feat: add browser Supabase client for TMA data fetching"
```

---

### Task 3: TMAInit компонент

**Files:**
- Create: `src/components/tma/TMAInit.tsx`

Инициализирует SDK один раз при монтировании. Безопасно падает если не в Telegram (для dev-браузера).

- [ ] **Step 1: Создать файл**

```typescript
// src/components/tma/TMAInit.tsx
'use client'

import { useEffect } from 'react'

export function TMAInit() {
  useEffect(() => {
    async function initTMA() {
      try {
        const sdk = await import('@tma.js/sdk')
        sdk.init()

        if (sdk.miniApp.isSupported()) {
          sdk.miniApp.mount()
        }

        if (sdk.themeParams.isSupported()) {
          sdk.themeParams.mount()
          sdk.themeParams.bindCssVars()
        }

        if (sdk.viewport.isSupported()) {
          await sdk.viewport.mount()
          sdk.viewport.expand()
          sdk.viewport.bindCssVars()
        }
      } catch {
        // Вне Telegram — нормально для dev в браузере
        console.warn('[TMA] Not in Telegram WebApp context — running in browser mode')
      }
    }

    initTMA()
  }, [])

  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tma/TMAInit.tsx
git commit -m "feat: add TMAInit component for SDK initialization"
```

---

### Task 4: TMA Layout

**Files:**
- Create: `src/app/(tma)/layout.tsx`

Добавляет Telegram WebApp script в `<head>` и монтирует TMAInit. Использует `--tg-theme-bg-color` переменную из SDK для фона.

- [ ] **Step 1: Создать файл**

```typescript
// src/app/(tma)/layout.tsx
import Script from 'next/script'
import { TMAInit } from '@/components/tma/TMAInit'

export default function TMALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Telegram WebApp SDK — обязательно для работы Mini App */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <TMAInit />
      <div
        className="min-h-screen"
        style={{ background: 'var(--tg-theme-bg-color, #f9fafb)' }}
      >
        {children}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(tma)/layout.tsx"
git commit -m "feat: add TMA layout with Telegram script and SDK init"
```

---

### Task 5: TMABackButton компонент

**Files:**
- Create: `src/components/tma/TMABackButton.tsx`

Показывает нативную кнопку "Назад" в шапке Telegram. При нажатии — `router.back()`.

- [ ] **Step 1: Создать файл**

```typescript
// src/components/tma/TMABackButton.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function TMABackButton() {
  const router = useRouter()

  useEffect(() => {
    let offClick: (() => void) | undefined

    import('@tma.js/sdk').then(({ backButton }) => {
      try {
        if (!backButton.isMounted()) {
          backButton.mount()
        }
        backButton.show()

        const handleClick = () => router.back()
        backButton.onClick(handleClick)

        offClick = () => {
          backButton.offClick(handleClick)
          backButton.hide()
        }
      } catch {
        // Вне Telegram
      }
    })

    return () => {
      offClick?.()
    }
  }, [router])

  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tma/TMABackButton.tsx
git commit -m "feat: add TMABackButton with native Telegram back navigation"
```

---

### Task 6: TMAOrderButton компонент

**Files:**
- Create: `src/components/tma/TMAOrderButton.tsx`

Кнопки заказа для TMA: открывает WhatsApp и Telegram через нативные методы SDK (`openLink`, `openTelegramLink`). Если SDK недоступен (dev-браузер) — fallback на `window.open`.

- [ ] **Step 1: Создать файл**

```typescript
// src/components/tma/TMAOrderButton.tsx
'use client'

import { buildWhatsAppUrl, buildTelegramUrl } from '@/lib/catalog-client'
import type { Client, Product } from '@/types'

interface TMAOrderButtonProps {
  client: Client
  product: Product
}

async function openExternalLink(url: string) {
  try {
    const { openLink } = await import('@tma.js/sdk')
    openLink(url)
  } catch {
    window.open(url, '_blank')
  }
}

async function openTelegramChat(url: string) {
  try {
    const { openTelegramLink } = await import('@tma.js/sdk')
    openTelegramLink(url)
  } catch {
    window.open(url, '_blank')
  }
}

export function TMAOrderButton({ client, product }: TMAOrderButtonProps) {
  const hasWhatsApp = Boolean(client.whatsapp)
  const hasTelegram = Boolean(client.telegram)

  if (!hasWhatsApp && !hasTelegram) return null

  return (
    <div className="flex flex-col gap-3 w-full">
      {hasWhatsApp && (
        <button
          onClick={() =>
            openExternalLink(buildWhatsAppUrl(client.whatsapp!, product.name, product.sku))
          }
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-green-500 active:bg-green-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Заказать в WhatsApp
        </button>
      )}
      {hasTelegram && (
        <button
          onClick={() =>
            openTelegramChat(buildTelegramUrl(client.telegram!, product.name, product.sku))
          }
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-blue-500 active:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Заказать в Telegram
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tma/TMAOrderButton.tsx
git commit -m "feat: add TMAOrderButton with native Telegram/WhatsApp links"
```

---

### Task 7: TMA страница со списком товаров

**Files:**
- Create: `src/app/(tma)/tma/[clientSlug]/page.tsx`

Client Component. Загружает клиента и товары через `catalog-client.ts`. Показывает поиск + фильтры по категориям + сетку товаров. Стили адаптированы под мобильный Telegram (меньше отступы).

- [ ] **Step 1: Создать файл**

```typescript
// src/app/(tma)/tma/[clientSlug]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getClientBySlugClient,
  getProductsClient,
} from '@/lib/catalog-client'
import type { Client, Product } from '@/types'

export default function TMACatalogPage() {
  const params = useParams<{ clientSlug: string }>()
  const clientSlug = params.clientSlug

  const [client, setClient] = useState<Client | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    async function load() {
      const c = await getClientBySlugClient(clientSlug)
      if (!c) { setLoading(false); return }
      const p = await getProductsClient(c.id)
      setClient(c)
      setProducts(p)
      setLoading(false)
    }
    load()
  }, [clientSlug])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p className="text-gray-500">Каталог не найден</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Заголовок */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
          {client.company_name}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
          {products.length} товаров
        </p>
      </div>

      {/* Поиск */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
        <input
          type="search"
          placeholder="Поиск по названию или артикулу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
          style={{
            background: 'var(--tg-theme-secondary-bg-color, #f9fafb)',
            borderColor: 'var(--tg-theme-hint-color, #e5e7eb)',
            color: 'var(--tg-theme-text-color, #111827)',
          }}
        />
      </div>

      {/* Фильтры категорий */}
      {categories.length > 0 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
          <button
            onClick={() => setCategory('all')}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={
              category === 'all'
                ? { background: 'var(--tg-theme-button-color, #3b82f6)', color: 'var(--tg-theme-button-text-color, #fff)' }
                : { background: 'var(--tg-theme-secondary-bg-color, #f3f4f6)', color: 'var(--tg-theme-text-color, #374151)' }
            }
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={
                category === cat
                  ? { background: 'var(--tg-theme-button-color, #3b82f6)', color: 'var(--tg-theme-button-text-color, #fff)' }
                  : { background: 'var(--tg-theme-secondary-bg-color, #f3f4f6)', color: 'var(--tg-theme-text-color, #374151)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Список товаров */}
      <div className="flex-1 px-4 py-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}>
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/tma/${clientSlug}/${product.slug}`}
                className="flex flex-col rounded-xl overflow-hidden border active:opacity-70 transition-opacity"
                style={{
                  background: 'var(--tg-theme-secondary-bg-color, #fff)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e7eb)',
                }}
              >
                {/* Изображение */}
                <div className="relative aspect-square bg-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}>
                      Нет фото
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div className="p-2 flex flex-col gap-1">
                  <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
                    Арт. {product.sku}
                  </p>
                  <p className="text-xs font-medium leading-tight line-clamp-2" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
                    {product.name}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                    <span className="text-xs font-normal ml-1" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
                      /{product.unit}
                    </span>
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full self-start font-medium"
                    style={
                      product.stock === 'В наличии'
                        ? { background: '#dcfce7', color: '#166534' }
                        : product.stock === 'Под заказ'
                        ? { background: '#fef9c3', color: '#854d0e' }
                        : { background: '#fee2e2', color: '#991b1b' }
                    }
                  >
                    {product.stock}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(tma)/tma/"
git commit -m "feat: add TMA product list page with search and category filters"
```

---

### Task 8: TMA карточка товара

**Files:**
- Create: `src/app/(tma)/tma/[clientSlug]/[productSlug]/page.tsx`

Client Component. Загружает товар, показывает фото, цену, описание, TMABackButton и TMAOrderButton.

- [ ] **Step 1: Создать файл**

```typescript
// src/app/(tma)/tma/[clientSlug]/[productSlug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  getClientBySlugClient,
  getProductBySlugClient,
} from '@/lib/catalog-client'
import { TMABackButton } from '@/components/tma/TMABackButton'
import { TMAOrderButton } from '@/components/tma/TMAOrderButton'
import type { Client, Product } from '@/types'

export default function TMAProductPage() {
  const params = useParams<{ clientSlug: string; productSlug: string }>()
  const { clientSlug, productSlug } = params

  const [client, setClient] = useState<Client | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const c = await getClientBySlugClient(clientSlug)
      if (!c) { setLoading(false); return }
      const p = await getProductBySlugClient(c.id, productSlug)
      setClient(c)
      setProduct(p)
      setLoading(false)
    }
    load()
  }, [clientSlug, productSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>Товар не найден</p>
      </div>
    )
  }

  const stockStyle =
    product.stock === 'В наличии'
      ? { color: '#16a34a' }
      : product.stock === 'Под заказ'
      ? { color: '#ca8a04' }
      : { color: '#dc2626' }

  return (
    <>
      {/* Нативная кнопка "Назад" в шапке Telegram */}
      <TMABackButton />

      <div className="flex flex-col min-h-screen pb-6">
        {/* Фото */}
        <div className="relative w-full aspect-square bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}
            >
              Нет фото
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="flex flex-col gap-4 px-4 pt-4">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
              Арт. {product.sku} · {product.category}
            </p>
            <h1
              className="text-xl font-bold leading-tight"
              style={{ color: 'var(--tg-theme-text-color, #111827)' }}
            >
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            <span style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
              / {product.unit}
            </span>
          </div>

          <p className="font-medium text-sm" style={stockStyle}>
            {product.stock}
          </p>

          {/* Кнопки заказа */}
          <TMAOrderButton client={client} product={product} />

          {/* Описание */}
          {product.description && (
            <div
              className="border-t pt-4"
              style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}
            >
              <h2
                className="font-semibold mb-2 text-sm"
                style={{ color: 'var(--tg-theme-text-color, #111827)' }}
              >
                Описание
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--tg-theme-hint-color, #374151)' }}
              >
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(tma)/tma/[clientSlug]/[productSlug]/"
git commit -m "feat: add TMA product detail page with back button and order buttons"
```

---

### Task 9: Проверка в браузере и настройка Telegram бота

**Шаг 1 — Проверка в браузере (без Telegram):**

- [ ] **Запустить сервер**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
npm run dev
```

- [ ] **Открыть список товаров в браузере**

Открыть: `http://localhost:3000/tma/demo`

Ожидаемое:
- Страница загружается со списком товаров
- Поиск и категории работают
- В консоли предупреждение: `[TMA] Not in Telegram WebApp context — running in browser mode` — это нормально

- [ ] **Открыть карточку товара**

Открыть: `http://localhost:3000/tma/demo/vtulka-rezinovaya-50h30`

Ожидаемое:
- Фото, название, цена, наличие
- Кнопки "Заказать в WhatsApp" и "Заказать в Telegram"
- Кнопки открывают ссылки с предзаполненным сообщением

---

**Шаг 2 — Настройка Telegram бота (для тестирования в реальном Telegram):**

- [ ] **Установить ngrok (один раз)**

```bash
# macOS через Homebrew
brew install ngrok/ngrok/ngrok
# Или скачать с https://ngrok.com/download
```

- [ ] **Создать туннель**

```bash
# В отдельном терминале (пока работает npm run dev)
ngrok http 3000
```

Скопировать HTTPS URL вида: `https://abc123.ngrok-free.app`

- [ ] **Создать Telegram бота**

1. Открыть Telegram → найти `@BotFather`
2. Отправить `/newbot`
3. Ввести имя: `Pricely Demo Bot`
4. Ввести username: `pricely_demo_bot` (или любой свободный)
5. Скопировать token бота

- [ ] **Создать Mini App в боте**

В чате с `@BotFather`:
```
/newapp
```
1. Выбрать своего бота
2. Ввести название: `Pricely Demo`
3. Ввести описание: `Каталог товаров`
4. Пропустить загрузку фото (отправить `/empty`)
5. Ввести URL: `https://abc123.ngrok-free.app/tma/demo`
6. Ввести short name: `catalog`

- [ ] **Открыть Mini App в Telegram**

Перейти по ссылке: `https://t.me/pricely_demo_bot/catalog`

Ожидаемое в Telegram:
- Открывается WebView с каталогом товаров
- Фон соответствует теме Telegram (светлая/тёмная)
- На карточке товара — нативная кнопка "Назад" в шапке
- Кнопки заказа открывают WhatsApp/Telegram нативно

- [ ] **Сохранить token бота в .env.local**

Добавить в `.env.local`:
```env
TELEGRAM_BOT_TOKEN=ваш_token_от_BotFather
```

- [ ] **Финальный коммит**

```bash
git add -A
git commit -m "feat: Day 4 complete — Telegram Mini App with native navigation and order buttons"
```
