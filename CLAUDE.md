@AGENTS.md

# Pricely — Claude Code Context

## Что строим
SaaS-сервис: загружаешь Excel-прайс → получаешь SEO-сайт-каталог + Telegram Mini App за 30 минут.
Целевая аудитория: оптовые компании РФ (стройматериалы, автозапчасти, одежда).

## Стек
- **Next.js 16** (App Router, SSR/SSG) — фронтенд + бэкенд
- **Supabase** (PostgreSQL + Auth + Storage) — база данных
- **Tailwind CSS v4 + shadcn/ui** — UI
- **Vercel** — деплой
- **Make.com** — парсинг Excel → Supabase
- **Prodamus** — платежи (РФ)
- **tma.js** — Telegram Mini App SDK

## Структура проекта
```
src/
├── app/
│   ├── (catalog)/          # публичные каталоги клиентов (SSR, SEO)
│   ├── (admin)/            # админ-панель клиента
│   └── api/                # API routes (webhook, upload, etc.)
├── components/
│   ├── catalog/            # компоненты каталога: ProductCard, Filters, etc.
│   ├── layout/             # Header, Footer, Navigation
│   └── ui/                 # shadcn/ui компоненты
├── lib/
│   └── supabase/           # client.ts (браузер), server.ts (SSR)
└── types/
    └── index.ts            # TypeScript типы: Client, Product, Order
```

## Мультитенантность
Каждый клиент = уникальный slug → субдомен `{slug}.pricely.ru` или кастомный домен.
Роутинг через Next.js middleware по hostname.

## Ключевые данные
- Google Sheets ID (тестовые данные): `12O4ZoANiNzvbj4hvaIks3oBEUJV4eNdx5XWivRy9Edo`
- Тарифы: telegram (990₽, 100 товаров), business (1490₽, 500), pro (2490₽, безлимит)

## Переменные окружения
См. `.env.example`. Локально — `.env.local` (не коммитится).

## Команды
```bash
npm run dev      # локальный сервер http://localhost:3000
npm run build    # production сборка
npm run lint     # проверка кода
```
