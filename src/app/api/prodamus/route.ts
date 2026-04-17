// src/app/api/prodamus/route.ts
import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifySign, parseTariff } from '@/lib/prodamus'
import { notifyAdmin } from '@/lib/telegram-notify'

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.PRODAMUS_SECRET_KEY
  // Require at least 32 characters to prevent weak-key HMAC bypass
  if (!secret || secret.length < 32) {
    console.error('[prodamus] PRODAMUS_SECRET_KEY is missing or too short (min 32 chars)')
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }

  // 1. Parse application/x-www-form-urlencoded body; reject duplicate keys
  let payload: Record<string, string>
  try {
    const text = await req.text()
    const params = new URLSearchParams(text)
    const seen = new Set<string>()
    for (const key of params.keys()) {
      if (seen.has(key)) {
        return NextResponse.json({ error: 'invalid body' }, { status: 400 })
      }
      seen.add(key)
    }
    payload = Object.fromEntries(params)
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  // 2. Verify HMAC-SHA256 signature
  if (!verifySign(payload, secret)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 3. Skip non-success payments (refunds, etc.) — still 200
  if (payload.payment_status !== 'success') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const clientSlug = payload.order_num
  if (!clientSlug) {
    return NextResponse.json({ error: 'missing order_num' }, { status: 400 })
  }

  const rawSum = Number(payload.sum)
  if (!isFinite(rawSum) || rawSum <= 0) {
    return NextResponse.json({ error: 'invalid sum' }, { status: 400 })
  }
  // Round to avoid float issues with sums like "990.00"
  const sum = Math.round(rawSum)

  // 4. Validate payment amount maps to a known tariff before touching the DB
  const tariff = parseTariff(sum)
  if (!tariff) {
    console.error('[prodamus] Unrecognised payment amount:', sum, 'for', clientSlug)
    await notifyAdmin(`⚠️ Webhook: неизвестная сумма\norder_num: ${clientSlug}\nСумма: ${sum} ₽`)
    return NextResponse.json({ error: 'invalid amount' }, { status: 422 })
  }

  // 5. Find client by slug
  const supabase = createAdminClient()
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, slug')
    .eq('slug', clientSlug)
    .single()

  if (clientError || !client) {
    console.error('[prodamus] Client not found:', clientSlug)
    await notifyAdmin(
      `⚠️ Webhook: клиент не найден\norder_num: ${clientSlug}\nСумма: ${sum} ₽`
    )
    return NextResponse.json({ error: 'client not found' }, { status: 404 })
  }

  // 6. Update client in Supabase
  const nextBillingDate = new Date()
  nextBillingDate.setDate(nextBillingDate.getDate() + 30)

  const { error: updateError } = await supabase
    .from('clients')
    .update({
      payment_status: 'active',
      tariff,
      next_billing_date: nextBillingDate.toISOString(),
    })
    .eq('id', client.id)

  if (updateError) {
    // Log full error server-side only; send sanitised message to admin
    console.error('[prodamus] DB update failed:', updateError)
    await notifyAdmin(`🚨 Webhook ошибка!\nКлиент: ${clientSlug}\nОбратитесь к логам сервера`)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }

  // 7. Notify admin
  const tariffLabel = { telegram: 'Telegram', business: 'Business', pro: 'Pro' }[tariff]
  const billingStr = nextBillingDate.toLocaleDateString('ru-RU')

  await notifyAdmin(
    `💰 Оплата получена!\nКлиент: ${clientSlug}\nТариф: ${tariffLabel}\nСумма: ${sum} ₽\nСледующее списание: ${billingStr}`
  )

  return NextResponse.json({ ok: true })
}

export async function GET(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' },
  })
}
