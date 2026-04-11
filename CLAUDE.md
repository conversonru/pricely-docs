@AGENTS.md

# Pricely — Claude Code Context

## Что строим
SaaS-сервис: загружаешь Excel-прайс → получаешь SEO-сайт-каталог + Telegram Mini App за 30 минут.
Целевая аудитория: оптовые компании РФ (стройматериалы, автозапчасти, одежда).

## Стек
- **Next.js 16** (App Router, SSR) — фронтенд + бэкенд
- **Supabase self-hosted** (PostgreSQL + RLS + Storage) — на VPS Timeweb Moscow (152-ФЗ)
- **Tailwind CSS v4 + shadcn/ui** — UI
- **Vercel** — деплой фронтенда
- **Make.com** — парсинг Excel → Supabase (День 5)
- **Prodamus** — платежи (РФ, День 7)
- **tma.js** — Telegram Mini App SDK (День 4)

## Инфраструктура
- **VPS:** 72.56.5.159 (Timeweb Cloud, Moscow, 2vCPU/4GB/80GB)
- **Supabase Studio:** http://72.56.5.159:3001 (без авторизации — только dev!)
- **Supabase API:** http://72.56.5.159:8000
- **SSH:** `ssh root@72.56.5.159` (RSA ключ)
- **Docker:** 13 контейнеров через docker-compose в /opt/pricely/

## База данных
- **Таблицы:** clients, products, orders, price_uploads
- **RLS политики:**
  - `products`: public SELECT для is_active=true
  - `clients`: public SELECT для payment_status='active'
- **Демо-клиент:** slug='demo', id='a9c5d522-f096-4bed-9f0f-c762aaae860d'
- **Миграция:** `infra/migrations/001_pricely_schema.sql`

## Структура проекта
```
src/
├── app/
│   ├── (catalog)/                          # публичные каталоги (SSR, SEO)
│   │   ├── layout.tsx                      # минимальный layout
│   │   └── catalog/
│   │       └── [clientSlug]/
│   │           ├── page.tsx                # список товаров + SEO metadata
│   │           └── [productSlug]/
│   │               └── page.tsx            # карточка товара + Schema.org
│   ├── (admin)/                            # админ-панель (День 6+)
│   └── api/                                # API routes (webhook, upload)
├── components/
│   ├── catalog/
│   │   ├── ProductCard.tsx                 # карточка товара (Image, Badge)
│   │   ├── ProductGrid.tsx                 # 'use client' — поиск + фильтры
│   │   ├── OrderButton.tsx                 # WhatsApp + Telegram кнопки
│   │   └── SchemaOrg.tsx                   # JSON-LD Product разметка
│   └── ui/                                 # shadcn/ui: card, badge, input, button, select
├── lib/
│   ├── catalog.ts                          # getClientBySlug, getProducts, getProductBySlug
│   └── supabase/
│       ├── client.ts                       # браузер-клиент (@supabase/ssr)
│       └── server.ts                       # сервер-клиент (async, cookies)
└── types/
    └── index.ts                            # Client, Product, Order, Tariff
```

## Мультитенантность
Текущий подход: path-based `/catalog/[clientSlug]`.
Будущий (День 6): subdomain-based `{slug}.pricely.ru` через Next.js middleware.

## Ключевые данные
- Google Sheets ID (тестовые данные): `12O4ZoANiNzvbj4hvaIks3oBEUJV4eNdx5XWivRy9Edo`
- Тарифы: telegram (990₽/100 товаров), business (1490₽/500), pro (2490₽/безлимит)

## Переменные окружения (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=http://72.56.5.159:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Команды
```bash
npm run dev      # локальный сервер http://localhost:3000
npm run build    # production сборка
npm run lint     # проверка кода
```

## Прогресс по дням
- [x] **День 1** — тестовые данные в Google Sheets (25 товаров, 3 листа)
- [x] **День 2** — VPS + self-hosted Supabase + схема БД + демо-клиент
- [x] **День 3** — SSR каталог: ProductCard, ProductGrid (фильтры), OrderButton, SchemaOrg, 2 страницы
- [ ] **День 4** — Telegram Mini App (tma.js)
- [ ] **День 5** — Excel → Make.com → Supabase автоматизация
- [ ] **День 6** — мультитенантность (subdomain routing)
- [ ] **День 7** — Prodamus платежи
- [ ] **День 8** — тестирование + запуск
