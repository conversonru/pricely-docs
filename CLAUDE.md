@AGENTS.md

# Pricely — Техническая документация

> Последнее обновление: 2026-04-11 · День 3 из 8

---

## Обзор проекта

SaaS для оптовых компаний РФ: загружаешь Excel-прайс → получаешь SEO-каталог + Telegram Mini App.

Пользовательская инструкция: `docs/GUIDE.md`

---

## Стек

| Слой | Технология | Версия | Назначение |
|------|-----------|--------|-----------|
| Фронтенд | Next.js App Router | 16.2.3 | SSR-рендеринг (Яндекс индексирует) |
| UI | Tailwind CSS v4 + shadcn/ui | — | Компоненты: card, badge, input, button, select |
| База данных | PostgreSQL (Supabase self-hosted) | — | Данные клиентов и товаров |
| Хостинг БД | Timeweb Cloud VPS, Moscow | — | 152-ФЗ: ПД в России |
| Хостинг фронт | Vercel | — | Edge SSR, CDN |
| Автоматизация | Make.com | — | Excel → Supabase (День 5) |
| Платежи | Prodamus | — | РФ-платёжная система (День 7) |
| Telegram | tma.js SDK | — | Mini App (День 4) |

---

## Инфраструктура

### VPS сервер

```
IP:            72.56.5.159
Провайдер:     Timeweb Cloud, Москва
Конфигурация:  2 vCPU / 4 GB RAM / 80 GB SSD
SSH:           ssh root@72.56.5.159  (RSA 4096)
Firewall UFW:  22 (SSH), 80 (HTTP), 443 (HTTPS), 8000 (Supabase API), 3001 (Studio)
```

### Supabase self-hosted

```
Docker compose:   /opt/pricely/docker-compose.yml
Контейнеров:      13 (db, kong, auth, rest, realtime, storage, studio, meta, pooler,
                     analytics, imgproxy, vector, edge-functions)
API endpoint:     http://72.56.5.159:8000
Studio UI:        http://72.56.5.159:3001  (без auth — только dev!)
```

### Ключи аутентификации (JWT HS256)

```
ANON_KEY:         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIs...
SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2Vydmlj...
```
> Полные ключи — в `.env.local` (не коммитится).

---

## База данных

### Схема

Файл: `infra/migrations/001_pricely_schema.sql`

**ENUM типы:**
- `tariff_type`: `telegram` | `business` | `pro`
- `payment_status`: `trial` | `active` | `expired`
- `stock_status`: `В наличии` | `Под заказ` | `Нет в наличии`
- `order_status`: `new` | `in_progress` | `completed` | `cancelled`

**Таблицы:**

| Таблица | Ключевые поля | RLS |
|---------|--------------|-----|
| `clients` | id, slug, company_name, telegram, whatsapp, email, tariff, payment_status | SELECT: payment_status='active' |
| `products` | id, client_id, sku, name, price, currency, category, stock, unit, slug, is_active, sort_order | SELECT: is_active=true |
| `orders` | id, client_id, product_id, order_text, status, source | — |
| `price_uploads` | id, client_id, filename, rows_total, rows_imported, status | — |

**Индексы:**
- `idx_products_client_id` — фильтрация по клиенту
- `idx_products_client_category` — фильтрация по категории
- `idx_products_search` — GIN полнотекстовый поиск (русский)

**Тестовые данные:**
```
clients: slug='demo', id='a9c5d522-f096-4bed-9f0f-c762aaae860d'
products: ~25 промышленных товаров (резинотехника, фитинги, крепёж)
```

### RLS политики (применены в Supabase)

```sql
-- products: публичное чтение активных товаров
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- clients: публичное чтение активных клиентов
CREATE POLICY "Public can view active clients" ON clients
  FOR SELECT USING (payment_status = 'active');
```

---

## Структура файлов

```
src/
├── app/
│   ├── (catalog)/                                  # route group, нет /catalog/ в URL layout
│   │   ├── layout.tsx                              # Server Component, bg-gray-50
│   │   └── catalog/
│   │       └── [clientSlug]/
│   │           ├── page.tsx                        # SSR список товаров + generateMetadata
│   │           └── [productSlug]/
│   │               └── page.tsx                    # SSR карточка + SchemaOrg + generateMetadata
│   ├── layout.tsx                                  # корневой layout (Geist font)
│   └── page.tsx                                    # главная страница (TODO: лендинг)
│
├── components/
│   ├── catalog/
│   │   ├── ProductCard.tsx    # Server Component: Link > Card > Image + price + stock badge
│   │   ├── ProductGrid.tsx    # 'use client': useState поиск + категории, рендерит ProductCard[]
│   │   ├── OrderButton.tsx    # Server Component: <a> WhatsApp/Telegram с pre-filled текстом
│   │   └── SchemaOrg.tsx      # Server Component: <script type="application/ld+json">
│   └── ui/                    # shadcn/ui: badge, button, card, input, select
│
├── lib/
│   ├── catalog.ts             # import 'server-only'; getClientBySlug, getProducts,
│   │                          # getProductBySlug, buildWhatsAppUrl, buildTelegramUrl
│   └── supabase/
│       ├── client.ts          # createBrowserClient (@supabase/ssr) — для Client Components
│       └── server.ts          # createServerClient (async, cookies) — для Server Components
│
└── types/
    └── index.ts               # Client, Product, Order, Tariff, TARIFF_LIMITS, TARIFF_PRICES
```

---

## Маршрутизация

### Текущая (path-based)
```
/catalog/[clientSlug]            → список товаров клиента
/catalog/[clientSlug]/[slug]     → карточка товара
```

### Будущая (День 6, subdomain-based)
```
{slug}.pricely.ru/               → список товаров
{slug}.pricely.ru/[productSlug]  → карточка товара
```
Реализация: Next.js middleware читает `req.headers.host`, извлекает slug, передаёт в запрос.

---

## SEO архитектура

**SSR (Server-Side Rendering)** — все страницы каталога рендерятся на сервере:
- `generateMetadata()` возвращает `<title>` и `<meta description>` под каждый товар/клиент
- HTML содержит полный контент без JavaScript → Яндекс индексирует

**Schema.org Product JSON-LD** (карточка товара):
```json
{
  "@type": "Product",
  "name": "...",
  "sku": "...",
  "offers": {
    "@type": "Offer",
    "price": 1500,
    "priceCurrency": "RUB",
    "availability": "https://schema.org/InStock"
  }
}
```
→ Яндекс показывает цену в сниппете поиска.

---

## Переменные окружения

Файл `.env.local` (не коммитится в git):

```env
NEXT_PUBLIC_SUPABASE_URL=http://72.56.5.159:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
TELEGRAM_BOT_TOKEN=          # заполнить в День 4
PRODAMUS_SECRET_KEY=         # заполнить в День 7
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=pricely.ru
```

Шаблон: `.env.example`

---

## Команды разработки

```bash
npm run dev      # запуск сервера: http://localhost:3000
npm run build    # production сборка (проверяет TypeScript)
npm run lint     # ESLint
```

**Проверка SSR (имитация Яндекс-бота):**
```bash
curl -s http://localhost:3000/catalog/demo | grep -o "Демо-каталог\|vtulka\|товаров"
```

**Посмотреть Schema.org на карточке:**
```bash
curl -s http://localhost:3000/catalog/demo/vtulka-rezinovaya-50h30 | grep "application/ld+json"
```

---

## Прогресс по дням

### ✅ День 1 — Тестовые данные
- Google Sheets ID: `12O4ZoANiNzvbj4hvaIks3oBEUJV4eNdx5XWivRy9Edo`
- 25 промышленных товаров, 3 листа (Products, Clients, Orders)
- Google Apps Script для автосоздания структуры
- Файлы: `data/products.csv`, `data/setup_sheets.gs`

### ✅ День 2 — Сервер + Supabase
- VPS Timeweb Cloud Moscow (2 180 ₽/мес, 152-ФЗ)
- Docker 29.4 + Nginx + UFW
- Self-hosted Supabase (13 контейнеров)
- Схема БД: 4 таблицы, RLS, GIN-индекс для русского поиска
- Демо-клиент: slug='demo'
- Файлы: `infra/`, `src/lib/supabase/`, `src/types/`

### ✅ День 3 — SEO каталог
- `src/lib/catalog.ts` — data fetching (server-only, error logging)
- `src/app/(catalog)/` — 2 SSR страницы с generateMetadata
- `src/components/catalog/` — ProductCard, ProductGrid (фильтры), OrderButton, SchemaOrg
- `next.config.ts` — разрешены внешние изображения
- RLS политика на `clients` добавлена в Supabase
- Проверка: SSR подтверждён через curl, Schema.org присутствует

### ⏳ День 4 — Telegram Mini App
- tma.js SDK
- Отдельный роут `/tma/[clientSlug]`
- Нативная навигация Telegram

### ⏳ День 5 — Excel → Supabase
- Make.com сценарий
- Парсинг .xlsx через встроенный модуль Make
- Upsert в таблицу products по (client_id, sku)
- Webhook-эндпоинт `/api/upload`

### ⏳ День 6 — Мультитенантность
- Next.js middleware: hostname → clientSlug
- Поддержка `{slug}.pricely.ru` и кастомных доменов
- Vercel Domain Routing

### ⏳ День 7 — Платежи
- Prodamus (РФ-эквайринг)
- Webhook `/api/prodamus`
- Обновление `payment_status` в clients

### ⏳ День 8 — Запуск
- GitHub → Vercel деплой
- Nginx конфиг с SSL (Let's Encrypt)
- Закрытие Supabase Studio за Basic Auth
- Регистрация в РКН как оператор ПД
- Smoke tests

---

## Архитектурные решения

| Решение | Почему |
|---------|--------|
| Self-hosted Supabase вместо облачного | 152-ФЗ: данные должны быть в РФ |
| Next.js SSR вместо Softr/Glide | Яндекс не индексирует CSR-приложения |
| Path-based routing сейчас | Проще для dev; subdomain в День 6 |
| Supabase anon key в Next.js | RLS ограничивает доступ; service key только на сервере |
| Tailwind v4 + shadcn/ui | Быстрая разработка, нет кастомного CSS |
