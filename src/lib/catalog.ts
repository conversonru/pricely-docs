import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Client, Product, Manager } from '@/types'
import { slugify } from '@/lib/slugify'

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('payment_status', 'active')
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog] getClientBySlug:', error.message)
    return null
  }
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
  if (error) {
    console.error('[catalog] getProducts:', error.message)
    return []
  }
  return data as Product[]
}

export async function getCategories(clientId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('client_id', clientId)
    .eq('is_active', true)
  if (error) {
    console.error('[catalog] getCategories:', error.message)
    return []
  }
  const unique = Array.from(new Set((data ?? []).map((r) => r.category).filter(Boolean))) as string[]
  return unique.sort()
}

/** Находит оригинальное название категории по её slug (транслитерации) */
export async function getCategoryBySlug(
  clientId: string,
  categorySlug: string
): Promise<string | null> {
  const categories = await getCategories(clientId)
  return categories.find((cat) => slugify(cat) === categorySlug) ?? null
}

export async function getProductsByCategory(
  clientId: string,
  category: string
): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('category', category)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('[catalog] getProductsByCategory:', error.message)
    return []
  }
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
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog] getProductBySlug:', error.message)
    return null
  }
  return data as Product
}

export async function getManagerByToken(token: string): Promise<Manager | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('managers')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .single()
  if (error) {
    if (error.code !== 'PGRST116') console.error('[catalog] getManagerByToken:', error.message)
    return null
  }
  return data as Manager
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
