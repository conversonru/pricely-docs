# Pricely — Technical Architecture

## 🏗 Общая схема
Excel/CSV (клиент)
↓
Google Sheets (единая база данных)
↓
├──────→ Softr.io (SEO-сайт, хостинг, домен)
│
├──────→ Glide Apps (Telegram Mini App)
│
└──────→ Make.com (автоматизация: Excel → Sheets)

text

## 🛠 Стек технологий

| Компонент | Инструмент | Почему |
| :--- | :--- | :--- |
| **База данных** | Google Sheets | Просто, бесплатно, клиенты умеют пользоваться. |
| **Сайт (фронтенд)** | Softr.io | Готовая SEO-оптимизация, чистые URL, адаптив, быстро. |
| **Mini App** | Glide Apps + Telegram Web App SDK | Поддержка PWA, легко интегрируется с Telegram. |
| **Автоматизация** | Make.com (бывший Integromat) | Парсинг Excel → Sheets, триггеры на обновления. |
| **Telegram-бот** | SaleBot / PuzzleBot (no-code) или aiogram (Python) | Кнопка «Открыть каталог», уведомления. |
| **Платежи** | Prodamus / Lava.top | Работают с самозанятыми/ИП в РФ, рекуррентные платежи. |
| **Хостинг** | Встроен в Softr/Glide | Не нужен отдельный сервер. |
| **Домен** | Любое .ru (Reg.ru, Nic.ru) | Для кастомных доменов клиентов. |

## 🔌 Интеграции

### 1. Google Sheets → Softr
- API: Нативная интеграция Softr.
- Частота обновления: 1–5 минут.
- Поля: Все столбцы из Sheets маппятся на поля в Softr.

### 2. Google Sheets → Glide
- API: Нативная интеграция Glide.
- Частота обновления: 1–2 минуты.
- Настройка: Включить «Telegram Web App» в настройках Glide.

### 3. Excel → Google Sheets (Make.com)
- Сценарий:
  1. Клиент загружает Excel в Google Drive (папка `/pricely-uploads`).
  2. Make парсит файл (XLSX Parser).
  3. Записывает строки в Google Sheets (таблица `Products`).
  4. Отправляет уведомление клиенту в Telegram: «Прайс обновлён!».

### 4. Telegram Bot → Mini App
- BotFather создаёт бота.
- В настройках бота указывается URL Mini App (Glide).
- Кнопка меню «🛍 Каталог» открывает Web App.

### 5. Платежи → Доступ
- Prodamus отправляет webhook на Make.com после оплаты.
- Make.com:
  - Добавляет клиента в базу (Google Sheets `Clients`).
  - Отправляет доступ (ссылку на Softr/Glide) в Telegram/email.

## 🔐 Безопасность
- Доступ к Google Sheets: только по API-ключу (read-only для Softr/Glide).
- SSL: Встроен в Softr/Glide (HTTPS).
- Данные клиентов: не хранятся, только в их собственных Google Sheets.

## 📈 Масштабируемость
- До 50 клиентов на одном аккаунте Softr (тариф Professional).
- До 50 клиентов на одном аккаунте Glide (тариф Pro).
- При росте > 100 клиентов: создание отдельных аккаунтов (white-label).
