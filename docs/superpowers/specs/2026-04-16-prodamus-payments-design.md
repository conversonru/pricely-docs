# День 7 — Платежи Prodamus

> Дата: 2026-04-16  
> Статус: approved

---

## Цель

Автоматически активировать клиента в Supabase после оплаты подписки через Prodamus. Отправлять уведомление администратору в Telegram при каждой оплате.

---

## Поток данных

```
Prodamus → POST /api/prodamus
     ↓
1. Проверка HMAC-SHA256 подписи (PRODAMUS_SECRET_KEY)
     ↓
2. Проверить payment_status == 'success'
     ↓
3. Извлечь client_slug из поля order_num
     ↓
4. Найти клиента в Supabase по slug
     ↓
5. Определить тариф по сумме: 990→telegram, 1490→business, 2490→pro
     ↓
6. Обновить clients: payment_status='active', tariff, next_billing_date=now+30дней
     ↓
7. Отправить Telegram уведомление администратору
     ↓
8. Вернуть 200 OK
```

---

## Компоненты

### 1. `src/lib/prodamus.ts` (новый)

Верификация подписи Prodamus и парсинг payload.

**Функции:**
- `verifySign(payload: Record<string, string>, secret: string): boolean` — проверяет HMAC-SHA256 подпись
- `parseTariff(sum: number): Tariff | null` — определяет тариф по сумме платежа

**Алгоритм подписи Prodamus:**
1. Отсортировать поля payload по ключу
2. Собрать строку `key=value&key=value...` (без поля `sign`)
3. HMAC-SHA256 с ключом `PRODAMUS_SECRET_KEY`
4. Сравнить с полем `sign` из payload

### 2. `src/lib/telegram-notify.ts` (новый)

Отправка сообщений администратору через Telegram Bot API.

**Функции:**
- `notifyAdmin(message: string): Promise<void>` — отправляет сообщение в `TELEGRAM_ADMIN_CHAT_ID`

Использует `fetch` к `https://api.telegram.org/bot{TOKEN}/sendMessage`.
Ошибки логирует в `console.error`, не бросает — webhook не должен падать из-за уведомления.

### 3. `src/app/api/prodamus/route.ts` (новый)

POST endpoint для webhook Prodamus.

**Логика:**
1. Парсить `application/x-www-form-urlencoded` тело
2. Верифицировать подпись через `verifySign` → 401 если не прошла
3. Проверить `payment_status === 'success'` → 200 (ничего не делать) если не успех
4. Найти клиента по `order_num` (это наш `client_slug`) → 404 + уведомление если не найден
5. Обновить клиента в Supabase (service_role ключ)
6. Отправить уведомление администратору
7. Вернуть 200 OK

**HTTP ответы:**
| Ситуация | Статус | Тело |
|---|---|---|
| Успешная оплата | 200 | `{"ok":true}` |
| Неуспешный платёж (refund и др.) | 200 | `{"ok":true,"skipped":true}` |
| Неверная подпись | 401 | `{"error":"unauthorized"}` |
| Клиент не найден | 404 | `{"error":"client not found"}` |
| Ошибка БД | 500 | `{"error":"internal error"}` |

---

## Переменные окружения

```env
PRODAMUS_SECRET_KEY=          # из настроек магазина в Prodamus
TELEGRAM_BOT_TOKEN=           # из @BotFather (не хранить в git!)
TELEGRAM_ADMIN_CHAT_ID=       # твой chat_id из getUpdates
```

---

## Формат Telegram уведомлений

**Успешная оплата:**
```
💰 Оплата получена!
Клиент: demo
Тариф: Business
Сумма: 1490 ₽
Следующее списание: 16.05.2026
```

**Клиент не найден:**
```
⚠️ Webhook: клиент не найден
order_num: unknown-slug
Сумма: 1490 ₽
```

**Ошибка БД:**
```
🚨 Webhook ошибка!
Клиент: demo
Ошибка: [текст ошибки]
```

---

## Создание платёжной ссылки (ручной процесс)

При добавлении нового клиента, администратор создаёт ссылку в кабинете Prodamus:
- **Название:** "Подписка Priceon — Business"
- **Сумма:** 1490
- **Номер заказа (order_num):** `demo` (slug клиента)
- **Успешная оплата:** ссылка на каталог клиента

---

## Что не меняется

- Каталог, TMA, n8n, proxy middleware — без изменений
- Таблица `clients` уже содержит нужные поля: `payment_status`, `tariff`, `next_billing_date`
