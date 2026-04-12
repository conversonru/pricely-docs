// src/lib/upload-service.ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { productSlug } from '@/lib/slugify'
import type { UploadPayload, UploadResult } from '@/types/upload'

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function uploadProducts(payload: UploadPayload): Promise<UploadResult> {
  const supabase = createAdminClient()
  const errors: string[] = []

  // 1. Найти клиента по slug
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, products_limit, tariff')
    .eq('slug', payload.client_slug)
    .single()

  if (clientError || !client) {
    return { imported: 0, failed: payload.products.length, errors: [`Client not found: ${payload.client_slug}`] }
  }

  // 2. Проверить лимит тарифа
  if (client.products_limit !== -1 && payload.products.length > client.products_limit) {
    return {
      imported: 0,
      failed: payload.products.length,
      errors: [`Tariff limit exceeded: plan allows ${client.products_limit} products, got ${payload.products.length}`],
    }
  }

  // 3. Upsert товаров по одному (чтобы отдельно логировать ошибки)
  let imported = 0
  let failed = 0

  for (const [i, p] of payload.products.entries()) {
    // Валидация обязательных полей
    if (!p.sku || !p.name || p.price === undefined || p.price === null) {
      errors.push(`Row ${i + 1}: missing required field (sku, name, or price)`)
      failed++
      continue
    }

    if (typeof p.price !== 'number' || p.price < 0) {
      errors.push(`Row ${i + 1} (sku=${p.sku}): price must be a non-negative number, got ${p.price}`)
      failed++
      continue
    }

    const slug = productSlug(p.name, p.sku)

    const row = {
      client_id: client.id,
      sku: p.sku.trim(),
      name: p.name.trim(),
      price: p.price,
      currency: p.currency ?? 'RUB',
      category: p.category?.trim() ?? '',
      description: p.description ?? null,
      image_url: p.image_url ?? null,
      stock: p.stock ?? 'В наличии',
      unit: p.unit?.trim() ?? 'шт',
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
      slug,
      is_active: true,
      sort_order: p.sort_order ?? 0,
    }

    const { error: upsertError } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'client_id,sku', ignoreDuplicates: false })

    if (upsertError) {
      errors.push(`Row ${i + 1} (sku=${p.sku}): ${upsertError.message}`)
      failed++
    } else {
      imported++
    }
  }

  // 4. Записать лог загрузки
  await supabase.from('price_uploads').insert({
    client_id: client.id,
    filename: 'make.com-import',
    rows_total: payload.products.length,
    rows_imported: imported,
    status: failed === 0 ? 'done' : 'error',
    error_log: errors.length > 0 ? errors.join('\n') : null,
  })

  return { imported, failed, errors }
}
