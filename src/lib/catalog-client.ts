import { createClient } from '@/lib/supabase/client'
import type { Client, Product } from '@/types'

export async function getClientBySlugClient(slug: string): Promise<Client | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('payment_status', 'active')
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog-client] getClientBySlug:', error.message)
    return null
  }
  return data as Client
}

export async function getProductsClient(clientId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('[catalog-client] getProducts:', error.message)
    return []
  }
  return data as Product[]
}

export async function getProductBySlugClient(
  clientId: string,
  slug: string
): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog-client] getProductBySlug:', error.message)
    return null
  }
  return data as Product
}

export function buildWhatsAppUrl(phone: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${text}`
}

export function buildTelegramUrl(username: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = username.replace(/^@/, '')
  return `https://t.me/${clean}?text=${text}`
}

export function buildMaxUrl(maxLink: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = maxLink.replace(/^@/, '').replace(/^https?:\/\/max\.ru\/u\//, '')
  return `https://max.ru/u/${clean}?text=${text}`
}
