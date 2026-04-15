# День 6 — Поддомены (Мультитенантность)

> Дата: 2026-04-15  
> Статус: approved

---

## Цель

Каждый клиент Priceon получает свой поддомен: `demo.price-on.ru` открывает SEO-каталог клиента с slug `demo`. TMA остаётся на path-based роутинге без изменений.

---

## Архитектура

```
Пользователь → demo.price-on.ru
     ↓
DNS: *.price-on.ru → 72.56.5.159 (VPS Timeweb, Москва)
     ↓
Nginx на VPS:
  - regex hostname: ~^(?<slug>[^.]+)\.price-on\.ru$
  - добавляет заголовок: X-Client-Slug: demo
  - проксирует на: pricely-docs.vercel.app (Host: pricely-docs.vercel.app)
     ↓
Next.js Middleware (Vercel Edge):
  - читает X-Client-Slug заголовок
  - rewrite: / → /catalog/demo
  - rewrite: /vtulka-50h30 → /catalog/demo/vtulka-50h30
     ↓
Существующий SSR каталог — без изменений
```

---

## Компоненты

### 1. `middleware.ts` (новый файл, корень проекта)

- Читает заголовок `x-client-slug` из запроса
- Если заголовок есть → rewrite на `/catalog/{slug}{path}`
- Если заголовка нет → пропускает запрос без изменений
- Matcher исключает: `_next/static`, `_next/image`, `favicon.ico`, `api/*`

### 2. Nginx конфиг на VPS (`/etc/nginx/sites-available/priceon-subdomains`)

- `server_name ~^(?<slug>[^.]+)\.price-on\.ru$;`
- SSL: wildcard сертификат `/etc/letsencrypt/live/price-on.ru/`
- Proxy: `proxy_pass https://pricely-docs.vercel.app`
- Заголовки: `X-Client-Slug $slug`, `Host pricely-docs.vercel.app`

### 3. DNS (у регистратора price-on.ru)

- A-запись: `*` → `72.56.5.159`
- A-запись: `@` → `72.56.5.159` (главная страница)

### 4. SSL — Let's Encrypt wildcard

- Certbot с DNS-01 challenge (требует добавления TXT-записи в DNS)
- Сертификат: `*.price-on.ru` + `price-on.ru`
- Если регистратор поддерживает API (Cloudflare, Timeweb DNS API) → автоматическое авторенью
- Если нет API → ручное обновление раз в 90 дней (или перенести DNS на Cloudflare — бесплатно)

### 5. Переменные окружения (Vercel)

- `NEXT_PUBLIC_APP_DOMAIN=price-on.ru`

---

## URL-маппинг

| Входящий URL | Внутренний путь | Компонент |
|---|---|---|
| `demo.price-on.ru/` | `/catalog/demo` | SSR список товаров |
| `demo.price-on.ru/vtulka-50h30` | `/catalog/demo/vtulka-50h30` | SSR карточка товара |
| `price-on.ru/tma/demo` | `/tma/demo` | TMA (без изменений) |
| `price-on.ru/catalog/demo` | `/catalog/demo` | Path-based (продолжает работать) |

---

## Что не меняется

- Весь код каталога (`src/app/(catalog)/`, `src/components/catalog/`, `src/lib/catalog.ts`)
- TMA роуты и компоненты
- API endpoints
- База данных

---

## Миграция на Vercel Pro (когда понадобится)

1. Добавить `*.price-on.ru` в Vercel Dashboard → Domains
2. Поменять DNS A-запись `*` с VPS на Vercel IP
3. Обновить middleware: читать `request.headers.get('host')` вместо `x-client-slug`
4. Убрать Nginx поддомен конфиг
5. Время: ~30 минут

---

## Порядок реализации

1. Купить домен `price-on.ru`
2. DNS: wildcard A-запись → VPS IP
3. VPS: получить wildcard SSL сертификат
4. VPS: настроить Nginx конфиг для поддоменов
5. Код: создать `middleware.ts`
6. Vercel: обновить `NEXT_PUBLIC_APP_DOMAIN`
7. Тест: `demo.price-on.ru` открывает каталог
