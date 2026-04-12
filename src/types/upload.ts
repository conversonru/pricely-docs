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
