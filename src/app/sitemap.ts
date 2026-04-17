import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, slug, updated_at')
    .eq('payment_status', 'active')

  if (!clients || clients.length === 0) return []

  const urls: MetadataRoute.Sitemap = []

  for (const client of clients) {
    urls.push({
      url: `https://${client.slug}.${domain}/`,
      lastModified: new Date(client.updated_at ?? Date.now()),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    const { data: products } = await supabase
      .from('products')
      .select('slug, category, updated_at')
      .eq('client_id', client.id)
      .eq('is_active', true)

    // Страницы категорий
    const categorySet = new Set<string>()
    for (const product of products ?? []) {
      if (product.category) categorySet.add(product.category)
    }
    for (const cat of categorySet) {
      urls.push({
        url: `https://${client.slug}.${domain}/category/${slugify(cat)}`,
        changeFrequency: 'daily',
        priority: 0.8,
      })
    }

    // Страницы товаров
    for (const product of products ?? []) {
      urls.push({
        url: `https://${client.slug}.${domain}/${product.slug}`,
        lastModified: new Date(product.updated_at ?? Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return urls
}
