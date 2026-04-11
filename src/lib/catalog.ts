import { createClient } from '@/lib/supabase/server'
import type { Client, Product } from '@/types'

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('payment_status', 'active')
    .single()
  if (error) return null
  return data as Client
}

export async function getProducts(clientId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) return []
  return data as Product[]
}

export async function getProductBySlug(
  clientId: string,
  slug: string
): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data as Product
}

export function buildWhatsAppUrl(phone: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${text}`
}

export function buildTelegramUrl(username: string, productName: string, sku: string): string {
  const text = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName} (арт. ${sku})`)
  const clean = username.replace('@', '')
  return `https://t.me/${clean}?text=${text}`
}
