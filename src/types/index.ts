// ── Клиент сервиса Pricely (оптовая компания) ──────────────────────────────
export type Tariff = 'telegram' | 'business' | 'pro'
export type PaymentStatus = 'active' | 'expired' | 'trial'

export interface Client {
  id: string
  slug: string              // уникальный идентификатор: "uralopt" → uralopt.pricely.ru
  company_name: string
  contact_name: string
  telegram: string | null
  whatsapp: string | null
  vk: string | null
  email: string
  tariff: Tariff
  products_limit: number    // 100 / 500 / -1 (безлимит)
  custom_domain: string | null
  payment_status: PaymentStatus
  next_billing_date: string | null
  created_at: string
}

// ── Товар в каталоге клиента ────────────────────────────────────────────────
export type StockStatus = 'В наличии' | 'Под заказ' | 'Нет в наличии'

export interface Product {
  id: string
  client_id: string
  sku: string               // артикул (ID из прайса)
  name: string
  price: number
  currency: string          // 'RUB'
  category: string
  description: string | null
  image_url: string | null
  stock: StockStatus
  unit: string              // 'шт', 'кг', 'м.п.'
  seo_title: string | null
  seo_description: string | null
  slug: string              // URL-friendly: 'vtulka-rezinovaya-50h30'
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Заказ (аналитика) ───────────────────────────────────────────────────────
export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled'

export interface Order {
  id: string
  client_id: string
  product_id: string | null
  customer_name: string | null
  customer_contact: string | null
  order_text: string
  status: OrderStatus
  created_at: string
}

// ── Тарифы ─────────────────────────────────────────────────────────────────
export const TARIFF_LIMITS: Record<Tariff, number> = {
  telegram: 100,
  business: 500,
  pro: -1,        // безлимит
}

export const TARIFF_PRICES: Record<Tariff, number> = {
  telegram: 990,
  business: 1490,
  pro: 2490,
}
