# Pricely — API & Integrations

## 1. Google Sheets API

### Чтение данных (Softr/Glide)
- **Метод:** `GET` (нативная интеграция).
- **Пример запроса:**
https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/Products!A2:M

text
- **Аутентификация:** API Key (read-only).

### Запись данных (Make.com)
- **Метод:** `POST` (через Make.com).
- **Сценарий:**
1. Парсинг Excel.
2. `Append Row` в таблицу `Products`.

## 2. Telegram Bot API

### Создание бота
- **Endpoint:** `https://api.telegram.org/bot{TOKEN}/getMe`
- **Команды:**
- `/start` — приветствие + кнопка «Открыть каталог».
- `/catalog` — открывает Mini App.

### Открытие Mini App
- **Кнопка:** `web_app` (тип кнопки в Telegram).
- **URL:** `https://your-glide-app.glideapp.io` (ссылка на Glide).
- **Пример:**
```json
{
  "text": "🛍 Открыть каталог",
  "web_app": {
    "url": "https://your-glide-app.glideapp.io"
  }
}
```

### Отправка уведомлений
- **Endpoint:** `https://api.telegram.org/bot{TOKEN}/sendMessage`
- **Пример:**
```json
{
  "chat_id": "{CLIENT_CHAT_ID}",
  "text": "Ваш прайс обновлён! Товаров: 350."
}
```

## 3. Prodamus (Платежи)

### Создание подписки
- **Endpoint:** `POST https://api.prodamus.com/api/v1/subscriptions`
- **Тело запроса:**
```json
{
  "name": "Pricely Business",
  "amount": 1490,
  "currency": "RUB",
  "period": "month",
  "success_url": "https://pricely.ru/success",
  "fail_url": "https://pricely.ru/fail"
}
```

### Webhook (успешная оплата)
- **Событие:** `payment.success`
- **Действие (Make.com):**
1. Найти клиента в `Clients` по email.
2. Обновить `Payment_Status` = `Active`.
3. Отправить доступ в Telegram.

## 4. Softr API (опционально, для авто-создания сайтов)

### Создание проекта
- **Endpoint:** `POST https://api.softr.io/v1/projects`
- **Тело запроса:**
```json
{
  "name": "{Client_Company} Catalog",
  "template": "catalog-template-id",
  "data_source": "google_sheets",
  "sheets_url": "{CLIENT_SHEETS_URL}"
}
```

## 5. Glide API (опционально)

### Обновление приложения
- **Endpoint:** `PUT https://api.glideapps.com/v2/apps/{APP_ID}`
- **Действие:** Обновить источник данных (Google Sheets).
