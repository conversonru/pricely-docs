# Pricely — Database Schema (Google Sheets)

## 📊 Таблица 1: `Products` (товары)

| Столбец | Тип | Пример | Обязательный | Описание |
| :--- | :--- | :--- | :--- | :--- |
| `ID` | Number | 1001 | ✅ | Уникальный артикул (SKU). |
| `Name` | Text | Втулка резиновая 50х30 | ✅ | Название товара (H1 на сайте). |
| `Price` | Number | 150 | ✅ | Цена в рублях. |
| `Currency` | Text | RUB | ✅ | Валюта (по умолчанию RUB). |
| `Category` | Text | Резинотехнические изделия | ✅ | Категория для фильтрации. |
| `Description` | Text | Втулка резиновая... | ❌ | SEO-описание (300–500 знаков). |
| `Image_URL` | Text | https://...jpg | ❌ | Ссылка на фото (Google Drive, Imgur). |
| `Stock` | Text | В наличии | ❌ | Наличие (В наличии / Под заказ). |
| `Unit` | Text | шт | ❌ | Единица измерения (шт, кг, м). |
| `SEO_Title` | Text | Втулка резиновая 50х30 — купить опт | ❌ | Авто-генерация: `{Name} — купить опт | {Company}`. |
| `SEO_Description` | Text | Втулка резиновая... Цена: 150 ₽ | ❌ | Авто-генерация по шаблону. |
| `Slug` | Text | vtulka-rezinovaya-50h30 | ❌ | Чистый URL (авто-генерация из Name). |
| `Created_At` | DateTime | 2026-04-11 10:00 | ✅ | Дата добавления. |
| `Updated_At` | DateTime | 2026-04-11 12:00 | ✅ | Дата последнего обновления. |

## 📊 Таблица 2: `Clients` (клиенты сервиса)

| Столбец | Тип | Пример | Описание |
| :--- | :--- | :--- | :--- |
| `Client_ID` | Number | 001 | Уникальный ID клиента. |
| `Company_Name` | Text | УралОпт | Название компании. |
| `Contact_Name` | Text | Иван Петров | Контактное лицо. |
| `Telegram` | Text | @ivan_opt | Telegram для связи. |
| `WhatsApp` | Text | +79991234567 | WhatsApp для заказов. |
| `Email` | Text | ivan@uralopt.ru | Email для уведомлений. |
| `Tariff` | Text | Business | Тариф (Telegram, Business, PRO). |
| `Products_Limit` | Number | 500 | Лимит товаров по тарифу. |
| `Custom_Domain` | Text | catalog.uralopt.ru | Кастомный домен (если есть). |
| `Softr_URL` | Text | https://...softr.app | Ссылка на сайт. |
| `Glide_URL` | Text | https://...glideapp.io | Ссылка на Mini App. |
| `Payment_Status` | Text | Active | Статус подписки (Active, Expired). |
| `Next_Billing_Date` | Date | 2026-05-11 | Дата следующего платежа. |

## 📊 Таблица 3: `Orders` (заказы, для аналитики)

| Столбец | Тип | Пример | Описание |
| :--- | :--- | :--- | :--- |
| `Order_ID` | Number | 5001 | Уникальный ID заказа. |
| `Client_ID` | Number | 001 | ID клиента (из Clients). |
| `Product_ID` | Number | 1001 | ID товара (из Products). |
| `Customer_Name` | Text | Алексей | Имя заказчика (из WhatsApp). |
| `Customer_Contact` | Text | +79990000000 | Телефон/Telegram заказчика. |
| `Order_Text` | Text | Хочу заказать: Втулка... | Текст заказа из мессенджера. |
| `Created_At` | DateTime | 2026-04-11 15:30 | Дата заказа. |
| `Status` | Text | New | Статус (New, In Progress, Completed). |
