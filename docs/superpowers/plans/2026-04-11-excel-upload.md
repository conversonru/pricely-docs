# Excel Upload Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Построить API эндпоинт `/api/upload`, который принимает JSON с товарами от Make.com и делает upsert в Supabase, плюс настроить Make.com сценарий для чтения Google Sheets и отправки данных.

**Architecture:** Make.com читает Google Sheets с прайсом клиента, собирает все строки в массив и отправляет POST-запрос на `/api/upload` с заголовком `Authorization: Bearer <UPLOAD_SECRET>`. Next.js API route проверяет секрет, ищет клиента по slug, проверяет лимит тарифа, делает upsert товаров в PostgreSQL по уникальному ключу `(client_id, sku)`. Слаг товара генерируется из названия путём транслитерации с русского.

**Tech Stack:** Next.js 16 Route Handlers, Supabase JS (service_role key), Make.com (Google Sheets → HTTP Request), TypeScript

---

## File Map

| Файл | Действие | Ответственность |
|------|----------|----------------|
| `src/lib/slugify.ts` | Создать | Транслитерация русского текста → URL slug |
| `src/types/upload.ts` | Создать | TypeScript типы для входящего payload от Make.com |
| `src/lib/upload-service.ts` | Создать | Бизнес-логика: валидация + upsert товаров через service_role |
| `src/app/api/upload/route.ts` | Создать | POST handler: auth → parse → вызов upload-service |
| `.env.local` | Обновить | Добавить `UPLOAD_SECRET` |
| `.env.example` | Обновить | Добавить `UPLOAD_SECRET` с комментарием |

---

### Task 1: Добавить UPLOAD_SECRET в окружение

**Files:**
- Modify: `.env.local`
- Modify: `.env.example`

- [ ] **Step 1: Сгенерировать секрет**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопировать вывод — это будет `UPLOAD_SECRET`.

- [ ] **Step 2: Добавить в .env.local**

Открыть `/Users/andreykudrasov/Claude/pricely-app/.env.local` и добавить в конец:

```env
# Make.com upload webhook secret — добавь это же значение в Make.com HTTP Request
UPLOAD_SECRET=сюда_вставить_сгенерированный_секрет
```

- [ ] **Step 3: Добавить шаблон в .env.example**

Открыть `/Users/andreykudrasov/Claude/pricely-app/.env.example` и добавить в конец:

```env
# Make.com — секрет для webhook /api/upload (сгенерируй: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
UPLOAD_SECRET=your_upload_secret
```

- [ ] **Step 4: Commit**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
git add .env.example
git commit -m "feat: add UPLOAD_SECRET env var for Make.com webhook auth"
```

> `.env.local` не коммитится (в .gitignore).

---

### Task 2: Функция транслитерации slug

**Files:**
- Create: `src/lib/slugify.ts`

- [ ] **Step 1: Создать файл**

```typescript
// src/lib/slugify.ts

const RU_MAP: Record<string, string> = {
  а: 'a',  б: 'b',  в: 'v',  г: 'g',  д: 'd',
  е: 'e',  ё: 'yo', ж: 'zh', з: 'z',  и: 'i',
  й: 'j',  к: 'k',  л: 'l',  м: 'm',  н: 'n',
  о: 'o',  п: 'p',  р: 'r',  с: 's',  т: 't',
  у: 'u',  ф: 'f',  х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sch',ъ: '',   ы: 'y',  ь: '',
  э: 'e',  ю: 'yu', я: 'ya',
}

/**
 * Транслитерирует русский текст в URL-friendly slug.
 * Пример: "Втулка резиновая 50х30" → "vtulka-rezinovaya-50h30"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((c) => RU_MAP[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

/**
 * Генерирует slug для товара из названия + артикула.
 * Артикул добавляется в конец для уникальности.
 * Пример: name="Болт М10x50", sku="B-042" → "bolt-m10x50-b-042"
 */
export function productSlug(name: string, sku: string): string {
  const namePart = slugify(name)
  const skuPart = slugify(sku)
  return `${namePart}-${skuPart}`.replace(/-+/g, '-').slice(0, 100)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/slugify.ts
git commit -m "feat: add Russian transliteration slugify utility"
```

---

### Task 3: TypeScript типы для upload payload

**Files:**
- Create: `src/types/upload.ts`

- [ ] **Step 1: Создать файл**

```typescript
// src/types/upload.ts
import type { StockStatus } from '@/types'

/**
 * Один товар из прайса — то, что Make.com отправляет в каждом элементе массива.
 * Все поля кроме sku, name, price — опциональные (Make.com может не заполнить).
 */
export interface UploadProduct {
  sku: string
  name: string
  price: number
  currency?: string          // default: 'RUB'
  category?: string          // default: ''
  description?: string | null
  image_url?: string | null
  stock?: StockStatus        // default: 'В наличии'
  unit?: string              // default: 'шт'
  seo_title?: string | null
  seo_description?: string | null
  sort_order?: number        // default: 0
}

/**
 * Полный payload от Make.com.
 */
export interface UploadPayload {
  client_slug: string
  products: UploadProduct[]
}

/**
 * Результат загрузки — возвращается в ответе API.
 */
export interface UploadResult {
  imported: number
  failed: number
  errors: string[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/upload.ts
git commit -m "feat: add upload payload TypeScript types"
```

---

### Task 4: Сервис загрузки товаров

**Files:**
- Create: `src/lib/upload-service.ts`

Использует `SUPABASE_SERVICE_ROLE_KEY` для обхода RLS (нужны права на INSERT/UPDATE).
Проверяет лимит тарифа. Делает upsert по `(client_id, sku)`.

- [ ] **Step 1: Создать файл**

```typescript
// src/lib/upload-service.ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { productSlug } from '@/lib/slugify'
import type { UploadPayload, UploadResult } from '@/types/upload'

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function uploadProducts(payload: UploadPayload): Promise<UploadResult> {
  const supabase = createAdminClient()
  const errors: string[] = []

  // 1. Найти клиента по slug
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, products_limit, tariff')
    .eq('slug', payload.client_slug)
    .single()

  if (clientError || !client) {
    return { imported: 0, failed: payload.products.length, errors: [`Client not found: ${payload.client_slug}`] }
  }

  // 2. Проверить лимит тарифа
  if (client.products_limit !== -1 && payload.products.length > client.products_limit) {
    return {
      imported: 0,
      failed: payload.products.length,
      errors: [`Tariff limit exceeded: plan allows ${client.products_limit} products, got ${payload.products.length}`],
    }
  }

  // 3. Upsert товаров по одному (чтобы отдельно логировать ошибки)
  let imported = 0
  let failed = 0

  for (const [i, p] of payload.products.entries()) {
    // Валидация обязательных полей
    if (!p.sku || !p.name || p.price === undefined || p.price === null) {
      errors.push(`Row ${i + 1}: missing required field (sku, name, or price)`)
      failed++
      continue
    }

    if (typeof p.price !== 'number' || p.price < 0) {
      errors.push(`Row ${i + 1} (sku=${p.sku}): price must be a non-negative number, got ${p.price}`)
      failed++
      continue
    }

    const slug = productSlug(p.name, p.sku)

    const row = {
      client_id: client.id,
      sku: p.sku.trim(),
      name: p.name.trim(),
      price: p.price,
      currency: p.currency ?? 'RUB',
      category: p.category?.trim() ?? '',
      description: p.description ?? null,
      image_url: p.image_url ?? null,
      stock: p.stock ?? 'В наличии',
      unit: p.unit?.trim() ?? 'шт',
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
      slug,
      is_active: true,
      sort_order: p.sort_order ?? 0,
    }

    const { error: upsertError } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'client_id,sku', ignoreDuplicates: false })

    if (upsertError) {
      errors.push(`Row ${i + 1} (sku=${p.sku}): ${upsertError.message}`)
      failed++
    } else {
      imported++
    }
  }

  // 4. Записать лог загрузки
  await supabase.from('price_uploads').insert({
    client_id: client.id,
    filename: 'make.com-import',
    rows_total: payload.products.length,
    rows_imported: imported,
    status: failed === 0 ? 'done' : 'error',
    error_log: errors.length > 0 ? errors.join('\n') : null,
  })

  return { imported, failed, errors }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/upload-service.ts
git commit -m "feat: add upload service with upsert logic and tariff limit check"
```

---

### Task 5: API route /api/upload

**Files:**
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: Создать файл**

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadProducts } from '@/lib/upload-service'
import type { UploadPayload } from '@/types/upload'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Проверить авторизацию
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const expectedSecret = process.env.UPLOAD_SECRET

  if (!expectedSecret) {
    console.error('[upload] UPLOAD_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (!token || token !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Распарсить тело запроса
  let payload: UploadPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 3. Базовая валидация структуры
  if (!payload.client_slug || typeof payload.client_slug !== 'string') {
    return NextResponse.json({ error: 'Missing client_slug' }, { status: 400 })
  }

  if (!Array.isArray(payload.products) || payload.products.length === 0) {
    return NextResponse.json({ error: 'products must be a non-empty array' }, { status: 400 })
  }

  // 4. Загрузить товары
  try {
    const result = await uploadProducts(payload)

    const status = result.failed === 0 ? 200 : result.imported === 0 ? 422 : 207
    return NextResponse.json(result, { status })
  } catch (err) {
    console.error('[upload] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Отклонить все остальные методы
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add POST /api/upload route with auth and validation"
```

---

### Task 6: Тестирование эндпоинта через curl

- [ ] **Step 1: Запустить dev сервер**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
npm run dev
```

- [ ] **Step 2: Прочитать UPLOAD_SECRET из .env.local**

```bash
grep UPLOAD_SECRET .env.local
```

Скопировать значение секрета.

- [ ] **Step 3: Тест без авторизации (должен вернуть 401)**

```bash
curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"client_slug":"demo","products":[]}' | python3 -m json.tool
```

Ожидаемый ответ:
```json
{"error": "Unauthorized"}
```

- [ ] **Step 4: Тест с неверным токеном (должен вернуть 401)**

```bash
curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-secret" \
  -d '{"client_slug":"demo","products":[]}' | python3 -m json.tool
```

Ожидаемый ответ:
```json
{"error": "Unauthorized"}
```

- [ ] **Step 5: Тест с пустым массивом (должен вернуть 400)**

Заменить `YOUR_SECRET` на реальное значение из `.env.local`:

```bash
curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"client_slug":"demo","products":[]}' | python3 -m json.tool
```

Ожидаемый ответ:
```json
{"error": "products must be a non-empty array"}
```

- [ ] **Step 6: Тест с реальными товарами (должен вернуть 200)**

```bash
curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{
    "client_slug": "demo",
    "products": [
      {
        "sku": "TEST-001",
        "name": "Тестовый товар API",
        "price": 999.00,
        "currency": "RUB",
        "category": "Тест",
        "stock": "В наличии",
        "unit": "шт"
      },
      {
        "sku": "TEST-002",
        "name": "Второй тестовый товар",
        "price": 1500.50,
        "category": "Тест",
        "unit": "кг"
      }
    ]
  }' | python3 -m json.tool
```

Ожидаемый ответ:
```json
{
  "imported": 2,
  "failed": 0,
  "errors": []
}
```

- [ ] **Step 7: Проверить в Supabase Studio**

Открыть http://72.56.5.159:3001 → Table Editor → products.
Найти строки с sku `TEST-001` и `TEST-002` — они должны появиться с client_id демо-клиента.

- [ ] **Step 8: Повторный тест (upsert — должен обновить, а не задублировать)**

```bash
curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{
    "client_slug": "demo",
    "products": [
      {
        "sku": "TEST-001",
        "name": "Тестовый товар API (обновлён)",
        "price": 1111.00,
        "category": "Тест",
        "unit": "шт"
      }
    ]
  }' | python3 -m json.tool
```

Ожидаемый ответ:
```json
{"imported": 1, "failed": 0, "errors": []}
```

В Supabase Studio `TEST-001` должен показывать цену `1111.00` и новое название — без дублей.

- [ ] **Step 9: Финальный коммит**

```bash
git add -A
git commit -m "feat: Day 5 complete — /api/upload endpoint working with upsert"
```

---

### Task 7: Настройка Make.com сценария (ручные шаги)

> Этот шаг — настройка внешнего сервиса Make.com. Выполняется вручную в браузере.

**Что будет сделано:** Make.com читает Google Sheets с прайсом, собирает все строки и отправляет на `/api/upload`. Запускается вручную или по расписанию.

**Предварительные условия:**
- Есть аккаунт на make.com (бесплатный план — 1000 операций/мес)
- Есть Google Sheets с прайсом (ID: `12O4ZoANiNzvbj4hvaIks3oBEUJV4eNdx5XWivRy9Edo`)
- Есть `UPLOAD_SECRET` из `.env.local`
- Запущен dev-сервер (или Vercel деплой для production)

---

**Шаг 1: Создать новый сценарий**

1. Зайти на [make.com](https://make.com) → **Create a new scenario**
2. Нажать **+ Add first module**

---

**Шаг 2: Google Sheets — прочитать все строки**

1. Выбрать **Google Sheets** → **Search Rows**
2. Нажать **Create a connection** → войти через Google аккаунт
3. Настроить:
   - **Spreadsheet ID**: `12O4ZoANiNzvbj4hvaIks3oBEUJV4eNdx5XWivRy9Edo`
   - **Sheet Name**: `Products`
   - **Filter** → оставить пустым (читать все строки)
   - **Column range**: оставить по умолчанию (A:N)
   - **First table row contains headers**: ✅ Включить

---

**Шаг 3: Array Aggregator — собрать строки в массив**

1. Нажать **+** после Google Sheets модуля
2. Выбрать **Flow Control** → **Array Aggregator**
3. Настроить:
   - **Source Module**: Google Sheets (предыдущий)
   - **Aggregated fields**: добавить маппинг каждой колонки:

| Ключ в массиве | Колонка Google Sheets | Тип |
|---|---|---|
| `sku` | `ID` (колонка A) | Text |
| `name` | `Name` (колонка B) | Text |
| `price` | `Price` (колонка C) | Number |
| `currency` | `Currency` (колонка D) | Text |
| `category` | `Category` (колонка E) | Text |
| `description` | `Description` (колонка F) | Text |
| `image_url` | `Image_URL` (колонка G) | Text |
| `stock` | `Stock` (колонка H) | Text |
| `unit` | `Unit` (колонка I) | Text |

---

**Шаг 4: HTTP Request — отправить на /api/upload**

1. Нажать **+** после Array Aggregator
2. Выбрать **HTTP** → **Make a request**
3. Настроить:
   - **URL**: `https://your-vercel-domain.vercel.app/api/upload`
     > Для dev: `https://abc123.ngrok-free.app/api/upload` (нужен ngrok)
   - **Method**: `POST`
   - **Headers**:
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer ВАШ_UPLOAD_SECRET`
   - **Body type**: `Raw`
   - **Content type**: `JSON (application/json)`
   - **Request content**:
     ```json
     {
       "client_slug": "demo",
       "products": {{Array Aggregator результат}}
     }
     ```
     > В поле products вставить переменную из Array Aggregator через кнопку Variables

---

**Шаг 5: Запустить сценарий вручную**

1. Нажать **Run once** (кнопка внизу)
2. Посмотреть результат каждого модуля (кружки с числами)
3. Убедиться что HTTP Request вернул `{"imported": N, "failed": 0, "errors": []}`

---

**Шаг 6 (опционально): Настроить расписание**

1. Нажать на часы рядом с первым модулем
2. Выбрать **Scheduling** → **Every day** → время (например, 08:00)
3. Теперь Make.com будет автоматически обновлять каталог каждый день

---

**Результат:** При каждом запуске Make.com читает Google Sheets и синхронизирует прайс-лист в Supabase. Клиент редактирует Google Sheets — каталог обновляется автоматически.
